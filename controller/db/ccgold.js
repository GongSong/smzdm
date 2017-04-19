let query = require('../../schema/mysql')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql')

async function setGoodList(goods) {
    if(typeof goods=='undefined'){
        goods = require('../data/ccgoldDetail.json')
    }
    for(let i=0;i<goods.length;i++){
        await query(sqlParser.handelCcgoldGoodsDetail(goods[i]));
        console.log(`第${i}/${goods.length}条库存数据插入完毕.ccgold`);
    }

}

module.exports = {
    setGoodList
}