const express = require('express');

const router = express.Router();
const dbclient = require('../model/database.js');

/* GET auth listing. */
router.get('/', async (req, res, next) => {
    if (('UUID' in req.body) && ('LID' in req.body)) {
        result = await dbclient.authenticate_list(req.body.LID, req.body.UUID);
        if (result) {
            res.json(result[0]);
        } else {
            res.status(404).end();
        }
    } else {
        res.status(400).end();
    }
});

/* POST auth for a given list and user. */
router.post('/admin', async (req, res, next) => {
    if (('UUID' in req.body) && ('LID' in req.body)) {
        result = await dbclient.create_admin(req.body.UUID, req.body.LID);
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
router.delete('/user', async (req, res, next) => {
    if ('LID' in req.body && 'UUID' in req.body && 'OUUID' in req.body) {
        // user needs to have admin or modify permissions
        const userPermission = await dbclient.authenticate_list(req.body.LID, req.body.UUID);

        if (dbclient.is_admin(userPermission)) {
            const contactPermission = await dbclient.user_in_list(req.body.OUUID, req.body.LID);
            if (contactPermission.rows[0]) {
                result = await dbclient.delete_contact(req.body.OUUID, req.body.LID);
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
