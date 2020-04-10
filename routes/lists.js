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
    if ('UUID' in body && 'listname' in body && 'Color' in body) {
        const lid = uuidGen.v4(); // creates a unique lid for the list
        console.log(lid);
        await dbclient.create_new_list(lid, body.listname, body.Colour);
        await dbclient.add_user(body.UUID, lid, 15);
        // user who created the list, must start as an admin
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
