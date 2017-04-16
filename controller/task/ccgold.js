let read = require('../shop/ccgold');
let save = require('../db/ccgold');
let needUpdate = require('./db').needUpdate;

async function init() {
    let flag = await needUpdate('ccgold_goods_detail');
    if (flag) {
        asyncData();
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