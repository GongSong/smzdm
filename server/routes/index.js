var express = require('express');
var router = express.Router();
var assertsDir = require('../conf/app').assertsDir;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(assertsDir + '/home.html');
});

module.exports = router;
