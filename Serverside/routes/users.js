var express = require('express');
var router = express.Router();
var dbclient = require('../model/database.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({"userid":"1234",'username':"krishc"});
  dbclient.query('select * from Users where username="scashin0"', (err, res) => {
    res.json((err, res));
  });
  dbclient.end();
});

module.exports = router;
