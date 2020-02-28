var express = require('express');
var router = express.Router();
var dbclient = require('../model/database.js');

/* GET a single item. */
router.get('/', async function(req, res, next) {
    if ("IID" in req.body && "UUID" in req.body) {
        let ret = await dbclient.get_item(req.body["IID"]);
        if (ret.rows) {
            permission = await dbclient.authenticate_list(ret.rows[0]['lid'],req.body['UUID']);
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
router.put('/', async function(req, res, next) {
    try {
        if ("LID" in req.body && "UUID" in req.body && 'Name' in req.body) {
            permission = await dbclient.authenticate_list(req.body['LID'],req.body['UUID']);
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

router.get('/check_completed', async function(req, res, next){
    if("LID" in req.body){
      let ret = await dbclient.check_completed(req.body["LID"])
      if(ret.rows){
        res.json(ret.rows[0])
      }else{
        res.status(404)
      }
    }else{
      res.status(400)
    }
    
})

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
});*/

module.exports = router;
