var express = require('express');
var router = express.Router();
var dbclient = require('../model/database.js');

/* GET a single item. */
router.get('/item', async function(req, res, next) {
    if ("IID" in req.body && "UUID" in req.body) {
        let ret = await dbclient.get_item(req.body["IID"]);
        if (ret.rows) {
            if (dbclient.authenticate_list(ret.rows[0]['lid'],req.body['UUID'])) {
                res.status(200).json(ret.rows[0]);
            }
        } else {
            res.status(404);
        }
    } else {
        res.status(400);
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
});*/

/* GET set of items. */
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