var express = require('express');
var router = express.Router();
var dirname = __dirname.replace('routes', 'public');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.sendFile(dirname + '/api.html');
});

module.exports = router;