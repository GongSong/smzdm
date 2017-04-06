let query = require('../../schema/mysql.js')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql.js')

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


function getGoodList(req, res, next) {
    let sqlStr = sql.query.wfx_itemid_list
    query(sqlStr, function(result) {
        let data = JSON.stringify(result)
        data = JSON.parse(data);
        next(data);
    })
}

module.exports = {
    setStockData,
    getGoodList
}