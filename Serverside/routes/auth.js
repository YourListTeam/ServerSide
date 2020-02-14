var express = require('express');
var router = express.Router();
var dbclient = require('../model/database.js');

/* GET auth listing. */
router.get('/', async function(req, res, next) {
    if (("UUID" in req.body) && ("LID" in req.body)) {
        result = await dbclient.authenticate_list(req.body["LID"], req.body["UUID"]);
        if (result) {
            res.json(result[0]);
        } else {
            res.status(404).end();
        }
    }
    else {
      res.status(400).end();
    }
});

/* POST auth for a given list and user. */
router.post('/admin', async function(req, res, next) {
    if (("UUID" in req.body) && ("LID" in req.body)) {
        result = await dbclient.create_admin(req.body["UUID"], req.body["LID"]);
        if (result.rows) {
            res.status(200).end();
        } else {
            res.status(409).end();
        }
    } else {
        res.status(400).end();
    }
});

module.exports = router;