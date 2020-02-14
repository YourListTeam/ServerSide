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

router.patch('/', async function(req, res, next){
  if("UUID" in req.body){
    let ret = await dbclient.get_user(req.body["UUID"])
    if(ret.rows){
      let user = ret.rows[0]
      if("name" in req.body){
        user.name = req.body["name"]
      }
      if("email" in req.body){
        user.email = req.body["email"]
      }
      if("home" in req.body){
        user.homelocation = req.body["home"]
      }
      dbclient.set_user(req.body["UUID"], user)
      res.status(200)
    }else{
      res.status(404)
    }
  } else {
    res.status(400)
  }
  res.end();
});

module.exports = router;
