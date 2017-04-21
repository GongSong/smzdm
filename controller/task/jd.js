let read = require('../shop/jd');
let save = require('../db/jd');
let db = require('./db');
let shopList = require('./jdShopList');

async function init() {
    let shopId = 170564;
    let flag = await db.needUpdate('jd_goods');
    console.log('\n\n正在同步jd');
    let goodsList = [];
    if (flag) {
        goodsList = await read.getGoodsList(shopId);
        // console.log(goodsList);
        await save.setGoodList(goodsList);
        db.setCrawlerStatus('jd_goods');
    }

    flag = await db.needUpdate('jd_comment');
    if (flag) {
        goodsList = goodsList.filter(item => item.totalCount > 0);
        await read.getComment(goodsList, shopId);
        db.setCrawlerStatus('jd_comment');
    }

    flag = await db.needUpdate('jd_shop');
    if (flag) {
        let shopInfo = await read.getShopTemplate(shopId);
        await save.setShopDetail(shopInfo);
        db.setCrawlerStatus('jd_shop');
    }

}

/**
 * 同步商品多家店铺的属性信息，用于最初的初始化，执行一次该函数后手动注释
 * 
 */
async function initJDShopInfo() {
    let shopInfo;
    for (let i = 0; i < shopList.length; i++) {
        await read.getShopTemplate(shopId);
        await save.setShopDetail(shopInfo);
    }
}


module.exports = {
    init
};