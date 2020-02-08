var express = require('express');
var router = express.Router();
var dbclient = require('../model/database.js');


/* GET users listing. */
router.get('/', async function(req, res, next) {
    if ("UUID" in req.body) {
      let ret = await dbclient.get_user(req.body["UUID"]);
      if (ret.rows) {
        res.status(200).json(ret.rows[0]);
      } else {
        res.status(404);
      }
    } else {
      res.status(400);
    }
});

module.exports = router;
