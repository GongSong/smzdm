var express = require('express');
var router = express.Router();
var dirname = __dirname.replace('routes', 'public');

var crawler = require('../controller/crawler');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.sendFile(dirname + '/api.html');
});

//友赞 店铺商品
router.get('/youzan/shop/:id', function(req, res) {
    crawler.youzan.getGoodsList(req, res);
});

//销售总量
router.get('/youzan/sales/:id', function(req, res) {
    crawler.youzan.getSaleInfo(req, res);
});

//销售详情
router.get('/youzan/detail/:id', function(req, res) {
    crawler.youzan.getSaleDetailById(req, res);
})

//微分销
router.get('/wfx/shop', function(req, res) {
    crawler.wfx.getGoodsList(req, res);
})

// 微分销评论
router.get('/wfx/comment', function(req, res) {
    crawler.wfx.getComment(req, res);
});
module.exports = router;