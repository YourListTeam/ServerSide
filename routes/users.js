const express = require('express');

const router = express.Router();
// const validator = require('validator');
const dbclient = require('../model/database.js');

/* GET users listing. */
router.get('/', async (req, res) => {
    if ('UUID' in req.body) {
        const ret = await dbclient.get_user(req.body.UUID);
        if (ret.rows) {
            res.status(200).json(ret.rows[0]);
        } else {
            res.status(404).end();
        }
    } else {
        res.status(400).end();
    }
});

router.patch('/', async (req, res) => {
    if ('UUID' in req.body) {
        const ret = await dbclient.get_user(req.body.UUID);
        if (ret.rows) {
            const user = ret.rows[0];
            if ('name' in req.body) {
                user.name = req.body.name;
            }
            if ('email' in req.body) {
                user.email = req.body.email;
            }
            if ('home' in req.body) {
                user.homelocation = req.body.home;
            }
            dbclient.set_user(req.body.UUID, user);
            res.status(200);
        } else {
            res.status(404);
        }
    } else {
        res.status(400);
    }
    res.end();
});


module.exports = router;
