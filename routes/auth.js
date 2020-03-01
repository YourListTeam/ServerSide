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

/* DELETE another user for a given list. */
router.delete('/user', async function(req, res, next) {
    if ("LID" in req.body && "UUID" in req.body && 'OUUID' in req.body) {
        // user needs to have admin or modify permissions
        user_permission = await dbclient.authenticate_list(req.body['LID'],req.body['UUID']);
        
        if (dbclient.is_admin(user_permission)) {
            contact_permission = await dbclient.user_in_list(req.body['OUUID'],req.body['LID']);
            if (contact_permission.rows[0]){
                result = await dbclient.delete_contact(req.body['OUUID'],req.body['LID']);
                res.status(200).end();
            } else {
                res.status(400).end();
            }
        } else {
            res.status(401).end();
        }
    } else {
        res.status(400).end();
    }
});

module.exports = router;