const express = require('express');
const uuidGen = require('uuid');
const dbclient = require('../model/database.js');

const router = express.Router();

/* GET list listing. */
async function getHandler(body) {
    const output = {};
    if ('LID' in body) {
        const ret = await dbclient.get_list(body.LID);
        if (ret.rows) {
            output.status = 200;
            [output.json] = [ret.rows[0]];
        } else {
            output.status = 404;
        }
    } else {
        output.status = 400;
    }
    return output;
}

router.get('/', async (req, res) => {
    const output = await getHandler(req.body);
    if ('json' in output) {
        res.status(output.status).json(output.json);
    } else {
        res.status(output.status).end();
    }
});

/* POST list. */
async function postHandler(body) {
    const output = {};
    if ('UUID' in body) {
        const lid = uuidGen.v4();
        await dbclient.create_new_list(lid, body.listname, body.Colour);
        await dbclient.add_user(body.UUID, lid, 15);
        output.status = 200;
    } else {
        output.status = 400;
    }
    return output;
}

router.post('/', async (req, res) => {
    const output = await postHandler(req.body);
    res.status(output.status).end();
});

async function getReadableHandler(body) {
    const output = {};
    if ('UUID' in body) {
        const perms = await dbclient.readable_lists(body.UUID);
        const r = [];
        for (let i = 0; i < perms.rows.length; i += 1) {
            r.push(perms.rows[i].lid);
        }
        output.json = r;
        output.status = 200;
    } else {
        output.status = 400;
    }
    return output;
}

router.get('/readable_lists', async (req, res) => {
    const output = await getReadableHandler(req.body);
    if ('json' in output) {
        res.status(output.status).json(output.json);
    } else {
        res.status(output.status).end();
    }
});

module.exports = router;