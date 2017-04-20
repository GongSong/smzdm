var express = require('express');
var router = express.Router();
var dirname = __dirname.replace('routes', 'public');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(dirname + '/index.html');
});

router.get('/jdtest', function(req, res, next) {
    require('../controller/shop/jd_comment').getCommentByGoods();
});

module.exports = router;