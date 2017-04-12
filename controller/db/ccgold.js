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

function setGoodList(req, res, next) {
    let arr = require('../data/ccgoldGoodsList.json')
    let spiderData = {
        data: arr
    }
    let sqlStr = sqlParser.handelCcgoldGoodsList(spiderData)
    query(sqlStr, function (result) {
        let str = JSON.stringify(result)
        res.send(str)
    })
}

function setGoodDetail(req, res, next) {
    let arr = require('../data/ccgoldGoodsDetail.json')
    let spiderData = {
        data: arr
    }
    let sqlStr = sqlParser.handelCcgoldGoodsDetail(spiderData)
    query(sqlStr, function (result) {
        let str = JSON.stringify(result)
        res.send(str)
    })
}

module.exports = {
    setStockData,
    setGoodList
}