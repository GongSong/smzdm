var axios = require('axios');
var parser = require('../util/htmlParser');

var spiderSetting = require('../util/spiderSetting');

// 获取商品主表信息
async function getGoodsById(url, page = 2) {
    console.log('正在抓取第' + page + '页');
    let config = {
        method: 'get',
        url,
        params: {
            p: page
        },
        headers: spiderSetting.headers.wfx
    }
    return await axios(config).then(res => {
        let goodItem = res.data;
        // 如果当前页无数据或小于每页最大产品数量10，则表示下一页无数据
        if (goodItem.length == 0 || goodItem.length < 10) {
            return goodItem;
            return [];
        }
        return getGoodsById(url, page + 1).then(res => [...goodItem, ...res]);
    }).catch(e => console.log(e));
}

function formatterData(obj, keys) {
    // 删除无用数据
    keys.forEach(key => Reflect.deleteProperty(obj, key));

    // 数据清洗
    if (obj.sales_volume == null) {
        obj.sales_volume = 0;
    }
    if (obj.category_id == null) {
        obj.category_id = 0;
    }
    return obj;
}

/**
 * 获取商品列表(价格、销量、库存、商品名、图片、链接)， 具体思路：
 * 
 * 1.所有接口均不能获取第1页最详细数据，在其它页数据中存储了产品销量，库存信息
 * 2.按价格从高至低获取第2-n页产品数据 A
 * 3.按价格从低至高获取第n-1,n页产品数据 B
 * 4.获取第3步B中最后10第数据，并同第2步A的数据合并
 * 
 */
function getGoodsList(req, res) {
    let urlUp = 'http://www.symint615.com/Item/lists/order/up';
    let urlDown = 'http://www.symint615.com/Item/lists/order/down';

    let goodList = [];
    getGoodsById(urlUp).then(response => {
        goodList = response;
        let page = parseInt(response.length / 10) + 1;
        return getGoodsById(urlDown, page);
    }).then(response => {
        let appendList = response.slice(response.length - 10, response.length);
        goodList = [...goodList, ...appendList];
        goodList.sort((a, b) => {
            return a.item_id - b.item_id;
        })

        let keys = ['hide_stock', 'buy_method', 'buy_url', 'is_show_sale', 'buy_need_points', 'is_compress', 'group', 'sale_num', 'basic_sales', 'join_level_discount', 'type'];
        goodList = goodList.map(item => formatterData(item, keys));
        res.json(goodList);
    });
}

module.exports = {
    getGoodsList
};