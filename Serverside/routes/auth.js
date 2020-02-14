var express = require('express');
var router = express.Router();
var dbclient = require('../model/database.js');

/* GET auth listing. */
router.get('/', function(req, res, next) {
    if (("UUID" in req.body) && ("LID" in req.body)) {
      dbclient.get_auth(res, req.body["UUID"],req.body["LID"])
    }
    else {
      res.status(400);
    }
  });

/* POST auth for a given list and user. */
router.post('/', function(req, res, next) {
  if (("UUID" in req.body) && ("LID" in req.body)) {
    dbclient.create_auth(res,req.body["UUID"], req.body["LID"])
  } else {
    res.status(400);
  }
});

module.exports = router;