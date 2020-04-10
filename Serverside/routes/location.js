const express = require('express');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const dbclient = require('../model/database.js');

const MAPBOX_ACCESS_TOKEN = process.env.mapbox;
const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_ACCESS_TOKEN });

const router = express.Router();

/* GET location coordinates from MapBox. */
async function getLocationHandler(body) {
    // query address to mapbox
    const promise = geocodingClient.forwardGeocode({
        query: body.Address,
        countries: ['ca'],
        limit: 3,
    })
        .send()
        .then((response) => {
            const match = response.body;
            return match;
        }).catch(() => null);
    return promise;
}

/* POST location. */
async function postLocationHandler(body) {
    const output = {};
    if ('LID' in body && 'UUID' in body && 'Address' in body && 'Name' in body) {
        // check if user has writing permission
        const permission = await dbclient.authenticate_list(body.LID, body.UUID);
        if (dbclient.can_write(permission)) {
            // forward encode given address mapbox to get its coordinates
            const match = await getLocationHandler(body);
            // check the result's relevance from query
            if (match.features[0].relevance >= 0.8) {
                const long = match.features[0].geometry.coordinates[0];
                const lat = match.features[0].geometry.coordinates[1];

                // add location to the table
                await dbclient.create_location(body.LID, lat, long, body.Name, body.Address);
                output.status = 200;
            } else {
                output.status = 404;
            }
        } else {
            output.status = 401;
        }
    } else {
        output.status = 400;
    }
    return output;
}

router.post('/', async (req, res) => {
    const output = await postLocationHandler(req.body);
    res.status(output.status).end();
});


async function getListLocationHandler(body) {
    const output = {};
    output.status = 400;
    if ('LID' in body && 'UUID' in body) {
        // check if user has read permission

        const permission = await dbclient.authenticate_list(body.LID, body.UUID);
        if (dbclient.can_read(permission)) {
            // forward encode given address mapbox to get its coordinates
            try {
                res = await dbclient.get_location(body.LID);
                if (res.rows.length) {
                    output.json = res.rows[0];
                    output.status = 200;
                } else {
                    output.status = 404;
                }
            } catch (e) {
                output.status = 500;
            }
        }
    }
    return Promise.resolve(output);
}

router.get('/', async (req, res) => {
    const output = await getListLocationHandler(req.body);
    console.log(output);
    if ('json' in output) {
        res.status(output.status).json(output.json);
    } else {
        res.status(output.status).end();
    }
});

/* GET distance from the list to user. */
async function calculateDistance(lid, body) {
    const currdist = await dbclient.get_list_location(lid).then((match) => {
        const output = {};
        if (match.rows[0]) {
            const R = 6371e3; // metres
            // getting the coordinates from the address
            const currLat = match.rows[0].address.x;
            const currLong = match.rows[0].address.y;
            // math to calculate distance
            const φ1 = (currLat * Math.PI) / 180;
            const φ2 = (body.Latitude * Math.PI) / 180;
            const Δφ = ((body.Latitude - currLat) * Math.PI) / 180;
            const Δλ = ((body.Longitude - currLong) * Math.PI) / 180;
            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2)
                    + Math.cos(φ1) * Math.cos(φ2)
                    * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c;
            output.status = 200;
            output.json = d; // distance in  km
            return output;
        }
        output.status = 404;
        return output;
    }).catch(() => null);
    return currdist;
}

/* GET all locations that the user can interact with. */
async function getAllLocations(body) {
    const output = {};

    if ('UUID' in body && 'Latitude' in body && 'Longitude' in body && 'Proximity' in body) {
        // a user that has any permission for a list
        // should be able to recieve notifications for that location
        const perms = await dbclient.in_list(body.UUID);
        const lists = [];
        const locations = [];
        // all of user's lists to iterate through
        for (let i = 0; i < perms.rows.length; i += 1) {
            lists.push(perms.rows[i].lid);
        }
        // calculate the distance for every list to the user
        const distances = await Promise.all(lists.map((list) => calculateDistance(list, body)));
        for (let i = 0; i < perms.rows.length; i += 1) {
            if ('json' in distances[i]) {
                // only if the distance is less or equal to the gven proximity
                // then that lists is within the scope to receieve a notification for
                if (distances[i].json <= body.Proximity) {
                    locations.push(perms.rows[i].lid);
                }
            }
        }
        output.json = locations;
        output.status = 200;
    } else {
        output.status = 400;
    }
    return output;
}

router.get('/', async (req, res) => {
    const output = await getAllLocations(req.body);
    if ('json' in output) {
        res.status(output.status).json(output.json);
    } else {
        res.status(output.status).end();
    }
});

module.exports = router;
