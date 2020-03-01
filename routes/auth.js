const express = require('express');
const dbclient = require('../model/database.js');

const router = express.Router();
/* GET auth listing. */
async function getHandler(body) {
    const output = {};
    if (('UUID' in body) && ('LID' in body)) {
        const result = await dbclient.authenticate_list(body.LID, body.UUID);
        if (result) {
            output.status = 200;
            [output.json] = [result[0]];
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

/* POST auth for a given list and user. */
async function postAdminHandler(body) {
    const output = {};
    if (('UUID' in body) && ('LID' in body)) {
        await dbclient.add_user(body.UUID, body.LID, 1111);
        output.status = 200;
    } else {
        output.status = 400;
    }
    return output;
}

router.post('/admin', async (req, res) => {
    const output = await postAdminHandler(req.body);
    res.status(output.status).end();
});

/* POST user for a given list and user. */
async function postUserHandler(body) {
    const output = {};
    if (('UUID' in body) && ('LID' in body) && ('OUUID' in body) && ('Permission' in body)) {
        // only a user with admin permissions can add another user as admin
        const userPermission = await dbclient.authenticate_list(body.LID, body.UUID);
        if (dbclient.is_admin(userPermission)) {
            // string must consist of only 1s and 0s
            const intPerm = parseInt(body.Permission, 2);
            if (body.Permission.match(/^[10]+$/)) {
                if (intPerm > 0 && intPerm <= 15) {
                    await dbclient.add_user(body.OUUID,
                        body.LID, body.Permission);
                    output.status = 200;
                    return output;
                }
            }
        }
    }
    output.status = 400;
    return output;
}

router.post('/user', async (req, res) => {
    const output = await postUserHandler(req.body);
    res.status(output.status).end();
});

module.exports = router;
