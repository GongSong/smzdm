var axios = require('axios');
var parser = require('../util/htmlParser');

var spiderSetting = require('../util/spiderSetting');

// 获取商品主表信息
async function getGoodsById(alias, page = 1) {
    console.log('正在抓取第' + page + '页');
    let config = {
        method: 'get',
        url: 'https://h5.youzan.com/v2/showcase/tag',
        params: {
            alias,
            page
        }
    }
    return await axios(config).then(res => {
        let goodItem = parser.youzan.goodsList(res.data);
        if (goodItem.length == 0) {
            return [];
        }
        return getGoodsById(alias, page + 1).then(res => [...goodItem, ...res]);
    }).catch(e => console.log(e));
}

// 获取商品列表
function getGoodsList(req, res) {
    // 8vcj4vsg
    let shopid = req.params.id;
    getGoodsById(shopid).then(response => {
        res.json(response);
    });
}

//获取单件商品总库存及总销量
async function getSaleDetail(item) {
    let config = {
        method: 'get',
        url: 'https://h5.youzan.com/v2/goods/' + item.alias,
        headers: spiderSetting.headers.youzan
    };

    return await axios(config).then(res => {
        let data = parser.youzan.goodsDetail(res.data);
        data = Object.assign(data, item);
        return data;
    });
}

// 获取销售详情
function getSaleInfo(req, res) {

    let shopid = req.params.id;
    // 此时使用缓存数据，不再重新拉取店铺商品列表

    let goods = require('../data/goodsList.json');

    // 数据测试
    // goods = [{
    //     "alias": "3nqefbegxt5aj",
    //     "goodId": 328309274
    // }];

    let data = goods.map(item => {
        return getSaleDetail({
            alias: item.alias,
            goodId: item.goodId
        })
    });

    Promise.all(data).then(item => {
        res.json(item);
    })
}

//获取单条商品销售记录
async function getItemSaleDetail(alias, page = 1) {
    let config = {
        method: 'get',
        url: 'https://h5.youzan.com/v2/trade/order/orderitemlist.json',
        params: {
            alias,
            page
        },
        headers: spiderSetting.headers.youzan
    }
    return await axios(config).then(res => {
        let saleItem = res.data.data.list;
        if (saleItem.length == 0) {
            return [];
        }
        return getItemSaleDetail(alias, page + 1).then(res => [...saleItem, ...res]);
    }).catch(e => console.log(e));
}

async function handleSaleDetail(item) {
    return await getItemSaleDetail(item.alias).then(response => {
        item.data = response;
        return item;
    });
}

// 获取单件商品销售详情
function getSaleDetailById(req, res) {
    let shopid = req.params.id;
    // 此时使用缓存数据，不再重新拉取店铺商品列表
    let goods = require('../data/goodsList.json');
    let data = goods.map(item => {
        return handleSaleDetail({
            alias: item.alias,
            goodId: item.goodId
        });
    });

    Promise.all(data).then(item => {
        res.json(item);
    });
}

module.exports = {
    getGoodsList,
    getSaleInfo,
    getSaleDetailById
};