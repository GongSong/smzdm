let util = require('./common');
let cheerio = require('cheerio');

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
    },
    shareInfo(html) {
        let rec_date = util.getNow();
        let $ = cheerio.load(html);
        let dom = $('.otherinfo').eq(1).find('span');
        let freight = dom.eq(1).text().replace(/\r\n/g, '').replace('运费:', '').replace('¥', '').trim();
        let score = dom.eq(2).text().replace(/\r\n/g, '').replace('赠送积分', '').trim();
        let share = $('.shareinfo').text().replace('点赞', '').replace('次', '');
        return {
            freight,
            score,
            share
        }
    },
    commentInfo(html) {
        let options = {
            html,
            parentNode: '.eva_box',
            children: [{
                node: 'h2',
                name: 'content'
            }, {
                node: '.comment_time span',
                name: 'user'
            }, {
                node: '.comment_time b',
                name: 'comment_time'
            }]
        }
        return util.parseHTML(options);
    }
};

let ccgold = {
    goodsList(html, cate_id) {
        let rec_date = util.getNow();
        let options = {
            html,
            parentNode: '.box-shadow',
            children: [{
                node: 'img',
                name: 'img',
                formatter(el) {
                    return el.data('original');
                }
            }, {
                node: '.li-t',
                name: 'title'
            }, {
                node: '.li-c',
                name: 'company'
            }, {
                node: '.li-price .f-30',
                name: 'price'
            }, {
                node: 'a',
                name: 'goodsId',
                formatter(el) {
                    return el.attr('href').split('goods_id=')[1].split('&')[0];
                }
            }, {
                node: 'a',
                name: 'url',
                formatter(el) {
                    return el.attr('href')
                }
            }],
            formatter(item) {
                item.rec_date = rec_date;
                item.cate_id = cate_id;
                return item;
            }
        }
        return util.parseHTML(options);
    },
    goodsDetail(html, goodsId) {
        let rec_date = util.getNow();
        let options = {
            html,
            parentNode: '.detail-container',
            children: [{
                node: '.con-fangDaIMg img',
                name: 'img',
                formatter(el) {
                    return el.data('original');
                }
            }, {
                node: '.shop-name',
                name: 'shop_name'
            }, {
                node: '.thing-name',
                name: 'good_name'
            }, {
                node: '.thing-price-huo',
                name: 'price',
                formatter(el) {
                    return el.text().replace('￥', '').trim()
                }
            }, {
                node: '.spec-item.thing-chi-span.on',
                name: 'weight'
            }, {
                node: '#shy',
                name: 'stock'
            }, {
                node: '.num-ku',
                name: 'sale_num',
                formatter(el) {
                    console.log(el.text().split('销售量'));
                    return el.text().split('销售量')[1];
                }
            }],
            formatter(item) {
                item.rec_date = rec_date;
                item.goods_id = goodsId;
                return item;
            }
        }
        return util.parseHTML(options);
    }
}

module.exports = {
    youzan,
    wfx,
    ccgold
}