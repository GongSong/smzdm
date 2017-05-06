let read = require('../shop/ctf');
let save = require('../db/ctf');
let db = require('./db');

async function init() {

    let flag, idx = 0;
    console.log('\n\n正在同步CTF');

    console.log(`${++idx}.开始同步商品列表.`);
    flag = await db.needUpdate('ctf_goods');
    if (flag) {
        await read.getGoodsList();
        await db.setCrawlerStatus('ctf_goods');
    }

    console.log(`${++idx}.开始同步商品列表.`);

    flag = await db.needUpdate('ctf_goods_detail');
    if (flag) {
        await read.getGoodsDetail();
        await db.setCrawlerStatus('ctf_goods_detail');
    }

    console.log('周大福交易记录同步完毕');
}

module.exports = {
    init
};