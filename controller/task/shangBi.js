let read = require('../shop/shangBi');
let save = require('../db/shangBi');
let db = require('./db');

async function init() {

    let flag, idx = 0;
    console.log('\n\n正在同步shCoin');

    console.log(`${++idx}.开始同步商品列表.`);
    let goodsList = [];
    flag = await db.needUpdate('sbireal_good');
    if (flag) {
        goodsList = await read.getGoodsList();
        await save.setGoodsData(goodsList);
        await db.setCrawlerStatus('sbireal_good');
    }
    console.log('上币商品列表同步完毕');
    // flag = await db.needUpdate('sbireal_trade');
    if (1) {
        goodsList = await read.getSaleInfo();
        await save.setSaleDetail(goodsList);
        await db.setCrawlerStatus('sbireal_trade');
    }
    console.log('上币交易记录同步完毕');
}

module.exports = {
    init
};