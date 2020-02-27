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
        result = await dbclient.add_user(req.body["UUID"], req.body["LID"], 1111);
        res.status(200).end();
    }
    else {
        res.status(400).end();
    }
});

/* POST user for a given list and user. */
router.post('/user', async function(req, res, next) {
    if (("UUID" in req.body) && ("LID" in req.body) && ("OUUID" in req.body) && ("Permission" in req.body)) {
        // only a user with admin permissions can add another user as admin
        user_permission = await dbclient.authenticate_list(req.body["LID"],req.body["UUID"]);
        if (dbclient.is_admin(user_permission)){
            if (parseInt(req.body["Permission"],2)<=15){
                result = await dbclient.add_user(req.body["OUUID"], req.body["LID"], req.body["Permission"]);
                res.status(200).end();
            } else {
                res.status(400).end();
            }
        }
        else if (dbclient.can_modify(user_permission)){
            if (parseInt(req.body["Permission"],2)<=7){
                result = await dbclient.add_user(req.body["OUUID"], req.body["LID"], req.body["Permission"]);
                res.status(200).end();
            } else {
                res.status(400).end();
            }
        }
        else {
            res.status(400).end();
        }
        
        
    }
    else {
        res.status(400).end();
    }
});

module.exports = router;