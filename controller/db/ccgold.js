let query = require('../../schema/mysql')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql')

async function insertData(sql) {
    return await query(sql, function(result) {
        let string = JSON.stringify(result)
        return string;
    });
}

function setGoodList(goods) {
    // let goods = require('../data/ccgoldDetail.json')
    let promises = [];
    goods.forEach(function(element) {
        promises.push(insertData(sqlParser.handelCcgoldGoodsDetail(element)));
    }, this);

    Promise.all(promises).then(item => {
        console.log({
            msg: '共' + promises.length + ' 条数据插入完毕'
        });
    });
}

module.exports = {
    setGoodList
}