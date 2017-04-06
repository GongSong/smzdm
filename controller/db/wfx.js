let query = require('../../schema/mysql.js')
let sqlParser = require('../util/sqlParser')

function setStockData(req, res) {
    let arr = require('../data/wfx_shenyang.json')
    let spiderData = {
        data: arr
    }
    let sql = sqlParser.handleWfxStockData(spiderData)
    query(sql, function(result) {
        let string = JSON.stringify(result)
        res.send(string)
    })
}

module.exports = {
    setStockData
}