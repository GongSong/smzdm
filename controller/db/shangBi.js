let query = require('../../schema/mysql');
let sqlParser = require('../util/sqlParser');
let sql = require('../../schema/sql');

async function setGoodsData(data) {
    let sqlStr = sqlParser.handleShCoinGoods(data);
    await query(sqlStr);
}

async function getGoodsList() {
    let sqlStr = sql.query.sb_ireal_goods;
    return await query(sqlStr);
}

async function setSaleDetail(arr) {
    if (arr.length == 0) {
        return;
    }
    let sqlStr = sqlParser.handleShCoinTrade(arr);
    await query(sqlStr);
}

module.exports = {
    setSaleDetail,
    setGoodsData,
    getGoodsList
}