let express = require('express');
let router = express.Router();
let dirname = __dirname.replace('routes', 'public');

let youzan = require('../controller/db/youzan');
let wfx = require('../controller/db/wfx');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.sendFile(dirname + '/api.html');
});

router.get('/youzan/goods', function(req, res, next) {
    youzan.getGoodsData(req, res);
});

router.get('/youzan/setGoodsData', function(req, res) {
    youzan.setGoodsData(req, res);
})

router.get('/youzan/setStockData', function(req, res, next) {
    youzan.setStockData(req, res);
});

router.get('/youzan/setSaleDetail', function(req, res) {
    youzan.setSaleDetail(req, res);
})

router.get('/wfx/setStockData', function(req, res, next) {
    wfx.setStockData(req, res);
});

module.exports = router;