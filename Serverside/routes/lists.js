const express = require('express');
const uuidGen = require('uuid');
const dbclient = require('../model/database.js');
const stc = require('string-to-color');

const router = express.Router();

/* GET list listing. */
async function getHandler(body) {
    const output = {};
    if ('LID' in body) {
        const ret = await dbclient.get_list(body.LID);
        if (ret.rows) {
            output.status = 200;
            ret.rows[0].hex = stc(ret.rows[0].colour);
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
    try {
        if ('UUID' in body && body.UUID != null && 'listname' in body && 'Color' in body) {
            console.log(body);
            const lid = uuidGen.v4();
            console.log(lid);
            await dbclient.create_new_list(lid, body.listname, body.Color);
            await dbclient.add_user(body.UUID, lid, 15);
            output.status = 200;
            output.json = {lid: lid}
        } else {
            output.status = 400;
        }
    } catch (e) {
        output.status = 500;
    }
    return output;
}

router.post('/', async (req, res) => {
    const output = await postHandler(req.body);
    if ('json' in output) {
        res.status(output.status).json(output.json);
    } else {
        res.status(output.status).end();
    }
});

/* GET lists that are readable to the user. */
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

/* DELETE a given list. */
async function deleteListHandler(body) {
    const output = {};
    if ('LID' in body && 'UUID' in body) {
        // user needs to have admin permissions to completely remove a list
        // to remove a user from a list, see delete /user in user route
        const userPermission = await dbclient.authenticate_list(body.LID, body.UUID);
        if (dbclient.is_admin(userPermission)) {
            await dbclient.delete_list(body.LID);
            output.status = 200;
        } else {
            output.status = 401;
        }
    } else {
        output.status = 400;
    }
    return output;
}

router.delete('/', async (req, res) => {
    const output = await deleteListHandler(req.body);
    res.status(output.status).end();
});

module.exports = router;
