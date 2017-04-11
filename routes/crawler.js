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

// 微分销页面详情
router.get('/wfx/detail', function(req, res) {
    crawler.wfx.getDetail(req, res);
});

// 微分销评论
router.get('/wfx/comment', function(req, res) {
    crawler.wfx.getComment(req, res);
});

// 微分销评论分割
router.get('/wfx/comment/split', function(req, res) {
    crawler.wfx.splitComment(req, res);
});

// 评论得分
router.get('/wfx/comment/score', function(req, res) {
    crawler.wfx.getCommentScore(req, res);
});


// ccGold
router.get('/ccgold/shop', function(req, res) {
    crawler.ccgold.getGoodsList(req, res);
});

// ccGold
router.get('/ccgold/detail', function(req, res) {
    crawler.ccgold.getGoodsDetail(req, res);
});

// cncoin商品列表
router.get('/cncoin/shop', function(req, res) {
    crawler.cncoin.getGoodsList(req, res);
});

// cncoin商品属性
router.get('/cncoin/detail', function(req, res) {
    crawler.cncoin.getDetail(req, res);
});

// cncoin
router.get('/cncoin/comment', function(req, res) {
    crawler.cncoin.getComment(req, res);
});

// cncoin test storage
router.get('/cncoin/test', function(req, res) {
    crawler.cncointest.test1(req, res);
});

// router.get('/cncoin/storage', function(req, res) {
//     crawler.cncoin.getStorage(req, res);
// })

module.exports = router;