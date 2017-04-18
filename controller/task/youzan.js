let read = require('../shop/youzan');
let save = require('../db/youzan');
let db = require('./db');

async function init() {
    let flag, idx = 0;
    console.log('\n\n正在同步youzan');
    let goodsList;
    flag = await db.needUpdate('yz_goods');
    if (flag) {
        console.log(`${++idx}.开始同步商品列表.`);
        goodsList = await read.getGoodsByShopName();
        if (goodsList.length == 0) {
            return;
        }
        await save.setGoodsData(goodsList);
        await db.setCrawlerStatus('yz_goods');
    }

    flag = await db.needUpdate('yz_stock');
    if (flag) {
        console.log(`${++idx}.开始同步库存信息.`);
        let storage = await read.getSaleInfo(goodsList);
        await save.setStockData(detail);
        await db.setCrawlerStatus('yz_stock');
    }

    flag = await db.needUpdate('yz_trade_record');
    if (flag) {
        console.log(`${++idx}.开始同步交易记录.`);
        let trades = await read.getTradRecord(goodsList);
        await save.setSaleDetail(trades);
        await db.setCrawlerStatus('yz_trade_record');
    }
    console.log('wfx数据同步完毕\n');
}

async function loadDefault() {
    // 商品列表信息/库存信息，该数据每日更新
    await save.setGoodsData();
    await save.setStockData();
    await save.setSaleDetail();
}

module.exports = {
    init,
    loadDefault
};