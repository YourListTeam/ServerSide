const express = require('express');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const dbclient = require('../model/database.js');

const MAPBOX_ACCESS_TOKEN = process.env.mapbox;
const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_ACCESS_TOKEN });

const router = express.Router();

async function getLocationHandler(body) {
    // query to mapbox
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
    output.status = 400;
    if ('LID' in body && 'UUID' in body && 'Address' in body && 'Name' in body) {
        // check if user has writing permission

        const permission = await dbclient.authenticate_list(body.LID, body.UUID);
        if (dbclient.can_write(permission)) {
            // forward encode given address mapbox to get its coordinates
            const getpromise = getLocationHandler(body).then((match) => {
            // check the result's relevance from query
                if (match.features[0].relevance >= 0.8) {
                    const long = match.features[0].geometry.coordinates[0];
                    const lat = match.features[0].geometry.coordinates[1];

                    // add location to the table
                    return creationpromise = dbclient.create_location(body.LID, lat,
                        long, body.Name, body.Address).then(() => {
                        output.status = 200;
                        return output;
                    }).catch(() => {
                        output.status = 500;
                        return output;
                    });
                }
                output.status = 404;
                return Promise.resolve(output);
            }).catch(() => null);
            return getpromise;
        }
    }
    return Promise.resolve(output);
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

module.exports = router;
