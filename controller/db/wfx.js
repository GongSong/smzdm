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
    let text = '我买的是1盎司的，而里面的包装盒却是个1／2盎司的，我是无语了';
    util.getNegativeWords(text).then(res => {
        console.log(res);
        console.log(res.data);
    })

    res.json({ text });
}

module.exports = {
    setStockData,
    getGoodList,
    setCommentData
}