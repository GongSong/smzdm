let cheerio = require('cheerio');

function goodsList(html) {
    let $ = cheerio.load(html);
    let goods = [];
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

function goodsDetail(html) {
    let $ = cheerio.load(html);
    let dom = $('.stock-detail dd');
    let obj = {
        freight: dom.eq(0).text().replace(/\n/, '').trim(),
        stock: dom.eq(1).text(),
        sales: dom.eq(2).text()
    }
    obj.sales = obj.sales === '' ? 0 : obj.sales;
    return obj;
}

module.exports = {
    goodsList,
    goodsDetail
}