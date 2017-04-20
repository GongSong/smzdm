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

module.exports = {
    setGoodList
}