let read = require('../shop/sge');
// let save = require('../db/sge');
let db = require('./db');

async function init() {
    let flag = await db.needUpdate('sge_trends');
    console.log('\n\n正在同步每日金价');
    if (flag) {
        await asyncData();
        db.setCrawlerStatus('sge_trends');
        return;
    }
    console.log('今日数据已上传，无需重复采集!\n');
}

async function asyncData() {
    let priceList = await read.getNewestPriceList();
    console.log(priceList);
    // await save.savePriceList(priceList);
}

module.exports = {
    init
};