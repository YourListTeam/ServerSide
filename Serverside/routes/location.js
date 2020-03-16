const express = require('express');
const dbclient = require('../model/database.js');
const mbxGeocoding = require('../../node_modules/@mapbox/mapbox-sdk/services/geocoding');
const MAPBOX_ACCESS_TOKEN = process.env.mapbox;
const geocodingClient = mbxGeocoding({accessToken: MAPBOX_ACCESS_TOKEN});

const router = express.Router();

async function getLocationHandler(body) {
  output={};
    var toSearch=body.Address;
    geocodingClient.forwardGeocode({
        query: toSearch,
        countries: ['ca'],
        limit: 3
      })
        .send()
        .then(response => {
          const match = response.body;
          // console.log(match.features[0].relevance);
          // console.log(match.features[0].geometry.coordinates);
          output.relevance = match.features[0].relevance;
          output.coordinates=match.features[0].geometry.coordinates;
          output.status=200;
          return output;
        });
}

/* POST location. */
async function postLocationHandler(body,callback) {
    const output = {};
    const forwardencoding={};
    if ('LID' in body && 'UUID' in body && 'Address' in body) {
        // check if user has writing permission
        output.status = 400;
        const permission = await dbclient.authenticate_list(body.LID, body.UUID);
        if (dbclient.can_write(permission)) {
          console.log(body.Address);
          // forward encode given address mapbox to get its coordinates
          var temp = await callback(body);
          console.log(temp);

          // check the result's relevance from query
          if (forwardencoding.rel >= 0.8){
            var long = forwardencoding.coo[0];
            var lat = forwardencoding.coo[1];
            console.log(long);
            console.log(lat);

            // must check if the location already exists in the table
            const locExists = await dbclient.check_location(body.LID,
            long, lat);
            console.log(locExists);

            // await dbclient.create_location(body.LID,long,lat);
            output.status = 200;
          }
            
      }
    } else {
        output.status = 400;
    }
    return output;
}

router.post('/', async (req, res) => {
    const output = await postLocationHandler(req.body,getLocationHandler);
    res.status(output.status).end();
});

module.exports = router;
