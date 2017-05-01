let read = require('../shop/shangBi');
let save = require('../db/shangBi');
let db = require('./db');

async function init() {

    let flag, idx = 0;
    console.log('\n\n正在同步shCoin');

    console.log(`${++idx}.开始同步商品列表.`);
    // 商品列表
    flag = await db.needUpdate('shcoin_goods');
    if (flag) {
        read.handleGoodsList();
        await db.setCrawlerStatus('shcoin_goods');
    }
    console.log(`${idx}.商品列表同步完毕.`);

}

module.exports = {
    init,
    // loadDefault
};