let express = require('express');
let router = express.Router();
let dirname = __dirname.replace('routes', 'public');

let api = require('../controller/api');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.sendFile(dirname + '/api.html');
});

router.get('/goods',function(req,res,next){
    api.getGoodsData(req,res);
});

router.get('/setGoodsData',function(req,res){
    api.setGoodsData(req,res);
})

router.get('/setStockData',function(req,res,next){
    api.setStockData(req,res);
});

router.get('/setSaleDetail',function(req,res){
    api.setSaleDetail(req,res);
})

module.exports = router;