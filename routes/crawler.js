var express = require('express');
var router = express.Router();
var dirname = __dirname.replace('routes', 'public');

var crawler = require('../controller/crawler');
var crawler = require('../controller/xcrawler');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.sendFile(dirname + '/api.html');
});

//店铺商品
router.get('/shop/:id', function(req, res) {
    crawler.getGoodsList(req, res);
});

//销售总量
router.get('/sales/:id', function(req, res) {
    crawler.getSaleInfo(req, res);
});

//销售详情
router.get('/detail/:id', function(req, res) {
    crawler.getSaleDetailById(req, res);
})

//店铺商品by XSLT
router.get('/xshop/:id', function(req, res) {
    xcrawler.getGoodsListByXslt(req, res);
});

module.exports = router;