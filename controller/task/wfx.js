let read = require('../shop/wfx');
let save = require('../db/wfx');
let db = require('./db');

async function init() {
    let flag, idx = 0;
    console.log('\n\n正在同步wfx');

    flag = await db.needUpdate('wfx_stock');
    if (flag) {
        console.log(`${++idx}.开始同步商品列表.`);
        let goodsList = await read.getGoodsList();
        await save.setStockData(goodsList);
        await db.setCrawlerStatus('wfx_stock');
    }

    flag = await db.needUpdate('wfx_item_marketing');
    if (flag) {
        console.log(`${++idx}.开始同步wfx_item_marketing.`);
        let detail = await read.getDetail();
        await save.setDetail(detail);
        await db.setCrawlerStatus('wfx_item_marketing');
    }

    flag = await db.needUpdate('wfx_comment_list');
    if (flag) {
        console.log(`${++idx}.开始同步评论信息.`);
        let comment = await read.handleComment();
        let segs = await read.splitComment(comment);
        let scores = await read.getCommentScore(comment);

        // 分词、nlp处理完毕之后再做入库操作
        await save.setCommentData(comment);
        await save.setCommentSplitData(segs);
        await save.setCommentScore(scores);

        await db.setCrawlerStatus('wfx_comment_list');
    }
    console.log('wfx数据同步完毕\n');
}

async function loadDefault() {
    // 商品列表信息/库存信息，该数据每日更新
    await save.setStockData();
    await save.setCommentData();
    await save.setCommentSplitData();
    await save.setCommentScore();
    await save.setDetail();
}

module.exports = {
    init,
    loadDefault
};