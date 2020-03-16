const express = require('express');
const dbclient = require('../model/database.js');
const mbxGeocoding = require('../../node_modules/@mapbox/mapbox-sdk/services/geocoding');
const MAPBOX_ACCESS_TOKEN = process.env.mapbox;
const geocodingClient = mbxGeocoding({accessToken: MAPBOX_ACCESS_TOKEN});

const router = express.Router();

router.get('/', async (req, res) => {
    const output = await getLocationHandler(req.body);
    res.status(200).end();
    
});

async function getLocationHandler(body) {
    geocodingClient.forwardGeocode({
        query: 'Paris, France',
        countries: ['fr'],
        limit: 2
      })
        .send()
        .then(response => {
          const match = response.body;
          console.log(match.features[0].geometry.coordinates);
        });
}

/* POST location. */
async function postLocationHandler(body) {
    const output = {};
    if ('LID' in body && 'UUID' in body && 'Address' in body) {
        // check if user has writing permission
        output.status = 400;
        const permission = await dbclient.authenticate_list(body.LID, body.UUID);
        if (dbclient.can_write(permission)) {
            // must check if the location already exists in the table
            const locExists = await dbclient.check_location(body.LID,
                body.Address.Longitude, body.Address.Latitude);
            if (!locExists.rows[0]) {
                // latitude is valid
                if (body.Address.Latitude >= -90 && body.Address.Latitude <= 90) {
                    // longitude is valid
                    if (body.Address.Longitude >= -180
                        && body.Address.Longitude <= 180) {
                        await dbclient.create_location(body.LID, body.Address.Longitude,
                            body.Address.Latitude);
                        output.status = 200;
                    }
                }
            }
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

module.exports = router;
