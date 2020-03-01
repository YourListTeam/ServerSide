const express = require('express');

const router = express.Router();
const dbclient = require('../model/database.js');

/* GET a single item. */
router.get('/', async (req, res, next) => {
    if ('IID' in req.body && 'UUID' in req.body) {
        const ret = await dbclient.get_item(req.body.IID);
        if (ret.rows) {
            const permission = await dbclient.authenticate_list(ret.rows[0].lid, req.body.UUID);
            if (dbclient.can_read(permission)) {
                res.status(200).json(ret.rows[0]);
            } else {
                res.status(401).end();
            }
        } else {
            res.status(404).end();
        }
    } else {
        res.status(400).end();
    }
});

/* PUT a single item. */
router.put('/', async (req, res, next) => {
    try {
        if ('LID' in req.body && 'UUID' in req.body && 'Name' in req.body) {
            const permission = await dbclient.authenticate_list(req.body.LID, req.body.UUID);
            if (dbclient.can_write(permission)) {
                result = await dbclient.add_item(req.body);
            } else {
                res.status(401).end();
            }
        } else {
            res.status(400).end();
        }
    } catch (err) {
        res.status(500).end();
    }
});

router.patch('/', async (req, res, next) => {
    try {
        if ('LID' in req.body && 'UUID' in req.body) {
            const permission = await dbclient.authenticate_list(req.body.LID, req.body.UUID);
            if (dbclient.can_write(permission)) {
                result = await dbclient.update_item(req.body);
            } else {
                res.status(401).end();
            }
        } else {
            res.status(400).end();
        }
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/completed', async (req, res, next) => {
    if ('IID' in req.body) {
        const ret = await dbclient.get_completed(req.body.IID);
        if (ret.rows) {
            res.json(ret.rows[0]);
        } else {
            res.status(404);
        }
    } else {
        res.status(400);
    }
});

router.post('/completed', async (req, res, next) => {
    try {
        if ('LID' in req.body && 'UUID' in req.body && 'Completed' in req.body) {
            const permission = await dbclient.authenticate_list(req.body.LID, req.body.UUID);
            if (dbclient.can_write(permission)) {
                result = await dbclient.set_completed(req.body.Completed);
            } else {
                res.status(401).end();
            }
        } else {
            res.status(400).end();
        }
    } catch (err) {
        res.status(500).end();
    }
});

/* GET all items from a list.
router.get('/items', async function(req, res, next) {
    if ("LID" in req.body) {
      let ret = await dbclient.get_items(req.body["LID"]);
      if (ret.rows) {
        res.status(200).json(ret.rows[0]);
      } else {
        res.status(404);
      }
    } else {
      res.status(400);
    }
});

 GET set of items.
router.get('/items', async function(req, res, next) {
    if ("LID" in req.body) {
      let ret = await dbclient.get_items(req.body["LID"]);
      if (ret.rows) {
        res.status(200).json(ret.rows[0]);
      } else {
        res.status(404);
      }
    } else {
      res.status(400);
    }
}); */

module.exports = router;
