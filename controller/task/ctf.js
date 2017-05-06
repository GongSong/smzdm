let read = require('../shop/ctf');
let save = require('../db/ctf');
let db = require('./db');

async function init() {

    let flag, idx = 0;
    console.log('\n\n正在同步CTF');
    console.log(`${++idx}.开始同步商品列表.`);
    await syncGoods();

    console.log(`${++idx}.开始同步商品详情.`);
    // 速度较慢，共同步一次即可。
    // await syncDetail();

    console.log('周大福交易记录同步完毕');
}

async function syncGoods() {
    let flag = await db.needUpdate('ctf_goods');
    if (flag) {
        await read.getGoodsList();
        await db.setCrawlerStatus('ctf_goods');
    }
}

async function syncDetail() {
    let flag = await db.needUpdate('ctf_goods_detail');
    if (flag) {
        await read.getGoodsDetail();
        await db.setCrawlerStatus('ctf_goods_detail');
    }
}

module.exports = {
    init
};