var axios = require('axios');
var parser = require('../util/htmlParser');

var spiderSetting = require('../util/spiderSetting');

// 获取商品主表信息
async function getGoodsListByCat(page = 1) {
    console.log('正在抓取第' + page + '页');
    let config = {
        method: 'get',
        url: 'http://www.ccgold.cn/shop/index.php',
        params: {
            url: 'search',
            fun: 'list',
            cate_id: page
        }
    }
    return await axios(config).then(res => {
        let goodItem = parser.ccgold.goodsList(res.data, page);
        if (goodItem.length == 0) {
            return [];
        }
        return getGoodsListByCat(page + 1).then(res => [...goodItem, ...res]);
    }).catch(e => console.log(e));
}

// 获取商品列表
function getGoodsList(req, res) {
    getGoodsListByCat().then(response => {
        res.json(response);
    });
}

module.exports = {
    getGoodsList
};