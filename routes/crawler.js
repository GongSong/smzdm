var express = require('express');
var fs = require('fs');
// var request = require('request');
var https = require('https');
var cheerio = require('cheerio');
var router = express.Router();
var app = express();

router.get('/shop/:id', function (req, res) {//8vcj4vsg
    console.log('started');
    let shopid = req.params.id;
    page_filter(res, shopid, 1).then(v => console.log(v),
    e => console.log(e));
});

var goods = [];
function htmlParser(html) {
    var $ = cheerio.load(html);
    if ($('li').hasClass('text-center empty-list')) {
        return 0;
    } else {
        $('.js-goods-card.goods-card.card').each(function (idx, e) {
            let goodElement = { alias: '', goodId: '', title: '', price: '', priceTaobao: '', imgSrc: '', isVirtual: '' };
            $(this).find($('.js-goods-buy.buy-response')).each(function (i, element) {
                goodElement.title = $(this).attr('data-title');
                goodElement.alias = $(this).attr('data-alias');
                goodElement.price = parseFloat($(this).attr('data-price'));
                goodElement.goodId = parseInt($(this).attr('data-id'));
                goodElement.isVirtual = parseInt($(this).attr('data-isvirtual'));
            });
            goodElement.imgSrc = $(this).find($('.goods-photo.js-goods-lazy')).data('src');
            let txt = $(this).find($('.goods-price-taobao')).text();
            goodElement.priceTaobao = (txt === null || txt.length === 0) ? 0 : parseFloat(txt.substr(3, txt.length - 3));
            goods.push(goodElement);
        });

        return 1;
    }
}

async function page_filter(res, shopid, page) {
    console.log('request for page ' + page);
    let url = 'https://h5.youzan.com/v2/showcase/tag?alias=' + shopid + '&page=' + page;
    https.get(url, function (response) {
        var html = '';
        response.on('data', function (data) {
            html += data;
        });
        response.on('end', function () {
            let result = htmlParser(html);
            if (result === 0) {
                console.log('没有更多结果');
                console.log('end');
                res.json(goods);
                res.end();
                return '没有更多结果';
            } else {
                console.log('response end for page ' + page);
                page_filter(res, shopid, (page + 1));
                return 'response end for page ' + page;
            }
        })
    });
}

module.exports = router;