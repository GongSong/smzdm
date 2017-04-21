let query = require('../../schema/mysql')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql')

async function setGoodList(goods) {
    if (typeof goods == 'undefined') {
        goods = require('../data/jd_goodsList.json')
    }
    await query(sqlParser.handleJDGoods(goods));
    console.log(`jd，${goods.length}条商品列表数据插入完毕`);
}

async function setShopDetail(shopDetail) {
    let url = sqlParser.handleJDShops(shopDetail);
    if (url.includes('undefined')) {
        console.log('数据提取失败,id:' + shopDetail.shopId);
        return;
    }
    await query(url);
    await query(sqlParser.handleJDCategory(shopDetail.shopCategories));
}

async function getShopList() {
    return await query(sql.query.jd_shopList);
}

module.exports = {
    setGoodList,
    setShopDetail,
    getShopList
}