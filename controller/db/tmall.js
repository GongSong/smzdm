let query = require('../../schema/mysql')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql')

// async function setGoodList(goods) {
//     await query(sqlParser.handleJDGoods(goods));
//     console.log(`jd，${goods.length}条商品列表数据插入完毕`);
// }

async function getShopList() {
    return await query(sql.query.tmall_shopList);
}

async function setShopDetail(shopDetail) {
    let url = sqlParser.handleTmallGoods(shopDetail);
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