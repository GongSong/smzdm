var express = require('express');
var router = express.Router();
var dirname = __dirname.replace('routes', 'public');

var crawler = require('../controller/crawler');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.sendFile(dirname + '/api.html');
});

router.get('/shop/:id', function(req, res) { //8vcj4vsg
    crawler.getRecordById(req, res);
});

module.exports = router;