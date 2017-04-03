let util = require('./common');

let youzan = {
    goodsList(html) {
        let rec_date = util.getNow();
        let options = {
            html,
            parentNode: '.js-goods-card.goods-card.card',
            children: [{
                node: '.js-goods-buy.buy-response',
                name: 'data',
                formatter(el) {
                    return {
                        title: el.data('title'),
                        alias: el.data('alias'),
                        price: el.data('price'),
                        isVirtual: el.data('isvirtual'),
                        goodId: el.data('id')
                    }
                }
            }, {
                node: '.goods-photo.js-goods-lazy',
                name: 'imgSrc',
                formatter(el) {
                    return el.data('src')
                }
            }, {
                node: '.goods-price-taobao',
                name: 'priceTaobao'
            }],
            formatter(obj) {
                obj.data.imgSrc = obj.imgSrc;
                obj.data.priceTaobao = obj.priceTaobao;
                obj.data.rec_date = rec_date;
                return obj.data;
            }
        }
        return util.parseHTML(options);
    },
    goodsDetail(html) {
        let rec_date = util.getNow();
        let options = {
            html,
            parentNode: '.stock-detail dd',
            mode: 1,
            children: [{
                name: 'freight',
                formatter(el) {
                    return el.text().replace(/\n/, '').trim();
                }
            }, {
                name: 'stock'
            }, {
                name: 'sales'
            }],
            formatter(obj) {
                obj.rec_date = rec_date;
                return obj;
            }
        }
        return util.parseHTML(options);
    }
};

let wfx = {
    // 更新查询方法后，该函数未使用，此处仅用于第1页数据的格式化演示
    goodsList(html) {
        let rec_date = util.getNow();
        let options = {
            html,
            parentNode: 'li.g-box.por',
            children: [{
                node: 'img',
                name: 'pic_url',
                formatter(el) {
                    return el.attr('src');
                }
            }, {
                node: '.addcart.J-goodsAddCart',
                name: 'item_id',
                formatter(el) {
                    return el.data('id');
                }
            }, {
                node: '.goods-detail a',
                name: 'link_item',
                formatter(el) {
                    return el.attr('href');
                }
            }, {
                node: '.goods-detail a',
                name: 'title'
            }, {
                node: '.goodstype .original_price',
                name: 'original_price',
                formatter(el) {
                    return el.text().replace('¥', '');
                }
            }, {
                node: '.nprice label',
                name: 'price'
            }],
            formatter(obj) {
                obj.rec_date = rec_date;
                return obj;
            }
        }
        return util.parseHTML(options);
    }
};


module.exports = {
    youzan,
    wfx
}