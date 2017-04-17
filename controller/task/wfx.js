let read = require('../shop/wfx');
let save = require('../db/wfx');
let db = require('./db');

async function init() {
    let flag, idx = 0;
    console.log('\n\n正在同步wfx');

    flag = await db.needUpdate('wfx_stock');
    if (flag) {
        console.log(`${++idx}.开始同步商品列表.`);

    }

    flag = await db.needUpdate('wfx_item_marketing');
    if (flag) {
        console.log(`${++idx}.开始同步wfx_item_marketing.`);

    }

    flag = await db.needUpdate('wfx_comment_list');
    if (flag) {
        console.log(`${++idx}.开始同步评论信息.`);

    }
}

async function loadDefault() {

    // 商品列表信息/库存信息，该数据每日更新
    await save.setStockData();


}

module.exports = {
    init,
    loadDefault
};