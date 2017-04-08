let query = require('../../schema/mysql.js')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql.js')
let util = require('../util/common')

// 从json取数据
function setStockData(req, res) {
    let arr = require('../data/wfx_shenyang.json')
    let spiderData = {
        data: arr
    }
    let sqlStr = sqlParser.handleWfxStockData(spiderData)
    query(sqlStr, function(result) {
        let str = JSON.stringify(result)
        res.send(str)
    })
}

// 从mysql取数
function getGoodList(req, res, next) {
    let sqlStr = sql.query.wfx_itemid_list
    query(sqlStr, function(result) {
        let data = JSON.stringify(result)
        data = JSON.parse(data);
        next(data);
    })
}

function setCommentData(req, res) {
    let comment = require('../data/wfx_comment.json');

    let item = comment[0][0];
    util.getNegativeWords(item.detail).then(obj => {
        obj.text = item.detail;
        obj.item_id = item.item_id;
        res.json(obj);
    })
}

module.exports = {
    setStockData,
    getGoodList,
    setCommentData
}