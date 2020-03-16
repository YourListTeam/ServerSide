const express = require('express');
const dbclient = require('../model/database.js');
const mbxGeocoding = require('../../node_modules/@mapbox/mapbox-sdk/services/geocoding');
const MAPBOX_ACCESS_TOKEN = process.env.mapbox;
const geocodingClient = mbxGeocoding({accessToken: MAPBOX_ACCESS_TOKEN});

const router = express.Router();

async function getLocationHandler(body) {
    // query to mapbox
    const toSearch=body.Address;
    const promise = geocodingClient.forwardGeocode({
        query: toSearch,
        countries: ['ca'],
        limit: 3
      })
        .send()
        .then(response => {
          const match = response.body;
          return match;
        }).catch(() => null);
      return promise;
}

/* POST location. */
async function postLocationHandler(body) {
    const output = {};
    const forwardencoding={};
    if ('LID' in body && 'UUID' in body && 'Address' in body) {
        // check if user has writing permission
        output.status = 400;
        const permission = await dbclient.authenticate_list(body.LID, body.UUID);
        if (dbclient.can_write(permission)) {

          // forward encode given address mapbox to get its coordinates
          const promise = getLocationHandler(body).then((match) => {

            // check the result's relevance from query
            if (match.features[0].relevance >= 0.8){
              var long = match.features[0].geometry.coordinates[0];
              var lat = match.features[0].geometry.coordinates[1];

              console.log(body.Address);
              console.log(match.features[0].geometry.coordinates);

              // add location to the table
              dbclient.create_location(body.LID,long,lat);
              output.status = 200;
            }
          }).catch(() => null);


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
