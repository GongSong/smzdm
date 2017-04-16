let read = require('../shop/ccgold');
let save = require('../db/ccgold');
let needUpdate = require('./db').needUpdate;

async function init() {
    await needUpdate('ccgold_goods_detail', data => {
        if (!data[0].need_update) {
            console.log('今日数据已上传，无需重复采集!\n');
            return;
        }
        asyncData();
    });
}

async function asyncData() {
    let goodsList = await read.getGoodsList();
    await save.setGoodList(goodsList);
}

module.exports = {
    init
};