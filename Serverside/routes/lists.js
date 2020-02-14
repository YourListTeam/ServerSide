var express = require('express');
var router = express.Router();
var dbclient = require('../model/database.js');

/* GET list listing. */
router.get('/', function(req, res, next) {
    if ("LID" in req.body) {
      dbclient.get_list(res, req.body["LID"])
    }
    else {
      res.status(400);
    }
});

/* POST created list. */
router.post('/', function(req, res, next) {
  if ("LID" in req.body) {
    dbclient.create_new_list(res,req.body["UUID"], req.body["LID"],req.body["listname"],req.body["Colour"])
  } else {
    res.status(400);
  }
});

module.exports = router;