let query = require('../../schema/mysql.js')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql.js')

async function insertData(sql) {
    return await query(sql, function (result) {
        let string = JSON.stringify(result)
        return string;
    });
}

function setGoodList(req, res, next) {
    let arr = require('../data/ccgoldGoodsList.json')
    
    let promises = [];
    arr.forEach(function (element) {
        promises.push(insertData(sqlParser.handelCcgoldGoodsList(element)));
    }, this);

    Promise.all(promises).then(item => {
        res.json({
            msg: '共' + promises.length + ' 条数据插入完毕'
        });
    });
}

function setGoodDetail(req, res, next) {
    let arr = require('../data/ccgoldDetail.json')
    let promises = [];
    arr.forEach(function (element) {
        promises.push(insertData(sqlParser.handelCcgoldGoodsDetail(element)));
    }, this);

    Promise.all(promises).then(item => {
        res.json({
            msg: '共' + promises.length + ' 条数据插入完毕'
        });
    });
}

module.exports = {
    setGoodList,
    setGoodDetail
}