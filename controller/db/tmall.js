let query = require('../../schema/mysql')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql')

async function setGoodList(goods) {
    if (goods.page_size) {
        await query(sqlParser.handleTmallGoods(goods));
    }
    console.log(`tmall，${goods.shop_title},${goods.page_size}条商品列表数据插入完毕`);
}

async function getShopList() {
    return await query(sql.query.tmall_shopList);
}

async function setShopDetail(shopDetail) {
    let url = sqlParser.handleTmallShops(shopDetail);
    if (url.includes('undefined')) {
        console.log('数据提取失败,id:' + shopDetail.shopId);
        return;
    }
    await query(url);
}

module.exports = {
    getShopList,
    setShopDetail,
    setGoodList,
}