let query = require('../../schema/mysql');
let sqlParser = require('../util/sqlParser');
let sql = require('../../schema/sql');

async function setGoodsData(data) {
    let sqlStr = sqlParser.handleCtfGoods(data);
    await query(sqlStr);
}

async function setGoodsDetail(data) {
    let sqlStr = sqlParser.handleCtfGoodsDetail(data);
    await query(sqlStr);
}

async function getGoodsList() {
    let sqlStr = sql.query.ctf_goods_no;
    return await query(sqlStr);
}

async function setGoodsWeight(goods) {
    let sqlStr = sqlParser.handleCtfGoodsWeight(goods);
    await query(sqlStr);
}

module.exports = {
    setGoodsData,
    setGoodsDetail,
    getGoodsList,
    setGoodsWeight
}