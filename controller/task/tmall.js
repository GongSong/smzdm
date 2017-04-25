let read = require('../shop/tmall');
let save = require('../db/tmall');
let db = require('./db');
let shopList = require('./tmallShopList').list;
let util = require('../util/common');

async function init() {
    // 载入店铺信息
    // await loadDefault();

    // 封ip
    // getGoodsFromUrl();
    read.dataTest();
    // getGoodsFromJson();
}

async function getGoodsFromUrl() {
    let localShopList = await save.getShopList();
    // 商品列表暂时不增量获取
    let maxNum = localShopList.length;
    maxNum = 1;
    for (let i = 0; i < maxNum; i++) {
        await read.getGoodsListAndSave(localShopList[i]);
    }
}

async function getGoodsFromJson() {
    let localShopList = await save.getShopList();
    // 商品列表暂时不增量获取
    let maxNum = localShopList.length;

    let page = {
        start: 33,
        end: 81
    }
    for (let i = page.start - 1; i <= page.end - 1; i++) {
        await read.getGoodsFromJsonAndSave(localShopList[i]);
    }

}


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