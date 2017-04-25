let read = require('../shop/jd');
let save = require('../db/jd');
let db = require('./db');
let shopList = require('./jdShopList').list;
let util = require('../util/common');

async function init() {
    // 载入店铺信息
    // await loadDefault();

    let localShopList = await save.getShopList();
    // 商品列表暂时不增量获取
    // for (let i = 1; i < localShopList.length; i++) {
    //     let shopId = localShopList[i].id;
    //     console.log(`正在获取${localShopList[i].name} 的商品列表数据`);
    //     await getGoodsByShopId(shopId, localShopList);
    // }

    for (let i = 1; i < localShopList.length; i++) {
        let shopId = localShopList[i].id;
        console.log(`正在获取${localShopList[i].name} 的评论数据`);
        await getCommentByShopInfo(localShopList[i]);
    }
}

async function getGoodsByShopId(shopId, goodsList) {
    let flag = await db.needUpdate('jd_goods' + shopId);
    console.log('\n\n正在同步jd');
    // let goodsList = [];
    if (flag) {
        // goodsList = await read.getGoodsList(shopId);
        // // console.log(goodsList);
        // await save.setGoodList(goodsList);
        await read.getGoodsListAndSave(shopId);
        db.setCrawlerStatus('jd_goods' + shopId);
    }
}

// 根据店铺信息获取对应数据
async function getCommentByShopInfo(shop) {
    flag = await db.needUpdate('jd_comment' + shop.id);
    if (flag) {
        await read.getComment(shop);
        db.setCrawlerStatus('jd_comment' + shop.id);
    }
}


/**
 * 同步商品多家店铺的属性信息，用于最初的初始化，执行一次该函数后手动注释
 * 
 */
async function initJDShopInfo() {
    let shopInfo;
    let localShopList = await save.getShopList();

    for (let i = 0; i < shopList.length; i++) {
        let shopId = shopList[i].id;
        let needSave = localShopList.filter(item => item.id == shopId);
        needSave = (needSave.length == 0);
        if (needSave) {
            shopInfo = await read.getShopTemplate(shopList[i]);
            await save.setShopDetail(shopInfo);
        }
    }
}

async function loadDefault() {
    // 商店信息初始化一次即可
    await initJDShopInfo();
}

module.exports = {
    init,
    loadDefault
};