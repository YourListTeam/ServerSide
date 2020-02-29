var express = require('express');
var router = express.Router();
var dbclient = require('../model/database.js');

/* GET list listing. */
router.get('/', function(req, res, next) {
    if ("LID" in req.body) {
      dbclient.get_list(res, req.body["LID"])
    }
    else {
      res.status(400).end();
    }
});

/* POST list. */
router.post('/', function(req, res, next) {
  if ("LID" in req.body) {
    dbclient.create_new_list(res,req.body["UUID"], req.body["LID"],req.body["listname"],req.body["Colour"])
  } else {
    res.status(400).end();
  }
});

router.get('/readable_lists', async function(req, res, next){
  if("UUID" in req.body){
    let perms = await dbclient.readable_lists(req.body["UUID"])
    r = []
    for(var i=0;i<perms.rows.length;i++){
      r.push(perms.rows[i]["lid"])
    }
    res.json(r)
    res.status(200)
  }else{
    res.status(400);
  }
});

module.exports = router;