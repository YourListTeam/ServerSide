var express = require('express');
var router = express.Router();
var dbclient = require('../model/database.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
    if ("UUID" in req.body) {
      dbclient.get_user(res, req.body["UUID"])
    } else {
      res.status(400);
    }
});

module.exports = router;
