let read = require('../shop/ccgold');
let save = require('../db/ccgold');
let db = require('./db');

async function init() {
    let flag = await db.needUpdate('ccgold_goods_detail');
    console.log('正在同步ccgold');
    if (flag) {
        await asyncData();
        db.setCrawlerStatus('ccgold_goods_detail');
        return;
    }
    console.log('今日数据已上传，无需重复采集!\n');
}

async function asyncData() {
    let goodsList = await read.getGoodsList();
    await save.setGoodList(goodsList);
}

module.exports = {
    init
};