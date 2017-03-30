var https = require('https');
var cheerio = require('cheerio');

function htmlParser(html) {
    var $ = cheerio.load(html);
    var goods = [];
    if ($('li').hasClass('text-center empty-list')) {
        return goods;
    }
    $('.js-goods-card.goods-card.card').each(function(idx, e) {
        let goodElement = { alias: '', goodId: '', title: '', price: '', priceTaobao: '', imgSrc: '', isVirtual: '' };
        $(this).find($('.js-goods-buy.buy-response')).each(function(i, element) {
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
    return goods;
}

async function page_filter(res, shopid, page = 1) {
    console.log('request for page ' + page);
    let url = 'https://h5.youzan.com/v2/showcase/tag?alias=' + shopid + '&page=' + page;
    https.get(url, function(response) {
        var html = '';
        response.on('data', function(data) {
            html += data;
        });
        response.on('end', function() {
            let result = htmlParser(html);
            if (result.length === 0) {
                console.log('没有更多结果');
                console.log('end');
                res.json(result);
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

function getRecordById(req, res) { //8vcj4vsg
    console.log('started');
    let shopid = req.params.id;
    page_filter(res, shopid).then(v => console.log(v),
        e => console.log(e));
}

module.exports = {
    getRecordById
};