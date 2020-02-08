var express = require('express');
var router = express.Router();
var dbclient = require('../model/database.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({"userid":"1234",'username':"krishc"});
  dbclient.fcn();
});

module.exports = router;
