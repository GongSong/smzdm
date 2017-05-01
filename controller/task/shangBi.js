let read = require('../shop/shangBi');
let save = require('../db/shangBi');
let db = require('./db');

async function init() {

    let flag, idx = 0;
    console.log('\n\n正在同步shCoin');

    console.log(`${++idx}.开始同步商品列表.`);
    flag = await db.needUpdate('sb_ireal_good');
    let goodsList = [];
    if (flag) {
        goodsList = await read.handleGoodsList();
        await save.setGoodsData(goodsList);
        await db.setCrawlerStatus('sb_ireal_good');
    }

    console.log(`${++idx}.开始同步商品列表.`);
    flag = await db.needUpdate('sb_ireal_good');
    let goodsList = [];
    if (flag) {
        goodsList = await read.handleGoodsList();
        await save.setGoodsData(goodsList);
        await db.setCrawlerStatus('sb_ireal_good');
    }
}

module.exports = {
    init,
    // loadDefault
};