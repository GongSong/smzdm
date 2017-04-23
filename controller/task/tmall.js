let read = require('../shop/tmall');
let save = require('../db/tmall');
let db = require('./db');
let shopList = require('./tmallShopList').list;
let util = require('../util/common');

async function init() {
    // 载入店铺信息
    // await loadDefault();

    let localShopList = await save.getShopList();
    // 商品列表暂时不增量获取

    for (let i = 0; i < localShopList.length; i++) {
        let shopId = localShopList[i].id;
        console.log(`(${i}/${localShopList.length}) 正在获取 ${localShopList[i].name} 的商品列表数据`);
        await read.getGoodsListAndSave(localShopList[i]);
    }

    // for (let i = 1; i < localShopList.length; i++) {
    //     let shopId = localShopList[i].id;
    //     console.log(`正在获取${localShopList[i].name} 的评论数据`);
    //     await getCommentByShopInfo(localShopList[i]);
    // }
}

// async function getGoodsByShopId(shopId, goodsList) {
//     let flag = await db.needUpdate('jd_goods' + shopId);
//     console.log('\n\n正在同步jd');
//     // let goodsList = [];
//     if (flag) {
//         await read.getGoodsListAndSave(shopId);
//         db.setCrawlerStatus('jd_goods' + shopId);
//     }
// }

// async function getCommentByShopInfo(shop) {
//     flag = await db.needUpdate('jd_comment' + shop.id);
//     if (flag) {
//         await read.getComment(shop);
//         db.setCrawlerStatus('jd_comment' + shop.id);
//     }
// }

async function initTmallShopInfo() {
    let shopInfo;
    let localShopList = await save.getShopList();
    let maxNum = shopList.length;
    for (let i = 42; i < maxNum; i++) {
        let url = shopList[i].url;
        let needSave = localShopList.filter(item => {
            if (url.includes(item.url)) {
                return item;
            }
        });
        needSave = (needSave.length == 0);
        if (needSave) {
            shopInfo = await read.getShopTemplate(shopList[i]);
            await save.setShopDetail(shopInfo);
        }
        // let sleepTimeLength = (1000 + Math.random() * 1000).toFixed(0);
        // await util.sleep(sleepTimeLength);
        console.log(`Tmall:${util.getNow()},第${i+1}/${maxNum}条店铺数据采集完毕.`);
    }
}

async function loadDefault() {
    // 商店信息初始化一次即可
    await initTmallShopInfo();
}

module.exports = {
    init,
    loadDefault
};