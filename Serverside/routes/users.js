var express = require('express');
var router = express.Router();
var dbclient = require('../model/database.js');
var validator = require('validator');


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

router.post('/', function(req, res, next){
  if("UUID" in req.body){
    if(dbclient.does_user_exist(req.body["UUID"])){
      if("name" in req.body){
        dbclient.set_name(req.body["name"], req.body["UUID"])
      }
      if("email" in req.body && validator.isEmail(req.body["email"])){
        dbclient.set_email(req.body["email"], req.body["UUID"])
      }
      if("home" in req.body){
        dbclient.set_home(req.body["home"], req.body["UUID"])
      }
      res.status(200)
    } else{
      res.status(400);
    }
  } else {
    res.status(400)
  }
  res.end();
});

module.exports = router;
