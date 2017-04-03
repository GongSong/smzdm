let cheerio = require('cheerio');
let getNow = require('./common').getNow;

function goodsList(html) {
    let rec_date = getNow();
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
    return getJson(options);
}

function goodsDetail(html) {
    let rec_date = getNow();
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
    return getJson(options);
}

/**
 * @param {any} options={
 *  html:'',
 *  parentNode:'', // 主结点
 *  children:{
 *      node:'', //子结点名
 *      name:'', //键值
 *      formatter(selecter) //格式转换,
 *      mode:0/1(0：默认，返回array，数据按children中定义；1：返回object,key按children定义)
 *  }
 * }
 */
function getJson(options) {
    let $ = cheerio.load(options.html);
    let data = [];
    let parentNode = $(options.parentNode);

    if (parentNode.length === 0) {
        return data;
    }

    if (typeof options.mode != 'undefined') {
        let data = {};
        parentNode.each((i, pNode) => {
            let item = options.children[i];
            let node = (typeof item.node === 'string') ? $(pNode).find(item.node) : $(pNode);
            data[item.name] = (typeof item.formatter === 'function') ? item.formatter(node) : node.text().trim();
            if (typeof options.formatter == 'function') {
                data = options.formatter(data);
            }
        });
        return data;
    }

    parentNode.each((i, pNode) => {
        let nodeData = {};
        options.children.forEach(item => {
            let node = (typeof item.node === 'string') ? $(pNode).find(item.node) : $(pNode);
            if (typeof item.formatter === 'function') {
                nodeData[item.name] = item.formatter(node);
            } else {
                let text = node.text().trim();
                nodeData[item.name] = text == '' ? 0 : text;
            }
        });

        if (typeof options.formatter == 'function') {
            nodeData = options.formatter(nodeData);
        }
        data.push(nodeData);
    });
    return data;
}

module.exports = {
    goodsList,
    goodsDetail
}