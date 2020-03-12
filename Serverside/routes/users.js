const express = require('express');

const router = express.Router();
// const validator = require('validator');
const dbclient = require('../model/database.js');

async function getHandler(body) {
    const output = {};
    if ('UUID' in body) {
        const ret = await dbclient.get_user(body.UUID);
        if (ret.rows.length) {
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

async function patchHandler(body) {
    const output = {};
    if ('UUID' in body) {
        const ret = await dbclient.get_user(body.UUID);
        if (ret.rows) {
            const user = ret.rows[0];
            if ('name' in body) {
                user.Name = body.name;
            }
            if ('email' in body) {
                user.Email = body.email;
            }
            if ('home' in body) {
                user.HomeLocation = body.home;
            }
            await dbclient.set_user(body.UUID, user);
            output.status = 200;
        } else {
            output.status = 404;
        }
    } else {
        output.status = 400;
    }
    return output;
}

async function postHandler(body) {
    const output = {};
    if ('UUID' in body) {
        // const ret = await dbclient.get_user(body.UUID);
        const parameters = [body.UUID];
        const fields = ['username', 'name', 'home', 'email'];
        for (let i = 0; i < fields.length; i += 1) {
            parameters.push((fields[i] in body) ? body[fields[i]] : null);
        }
        const result = await dbclient.create_user(parameters);
        if (result.rows) {
            output.status = 200;
        } else {
            output.status = 409;
        }
    } else {
        output.status = 400;
    }
    return output;
}

/* GET users listing. */
router.get('/', async (req, res) => {
    const output = await getHandler(req.body);
    if ('json' in output) {
        res.status(output.status).json(output.json);
    } else {
        res.status(output.status).end();
    }
});

router.patch('/', async (req, res) => {
    const output = await patchHandler(req.body);
    res.status(output.status).end();
});

router.post('/', async (req, res) => {
    const output = await postHandler(req.body);
    res.status(output.status).end();
});


module.exports = router;
