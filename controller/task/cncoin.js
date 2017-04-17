let read = require('../shop/cncoin');
let save = require('../db/cncoin');
let storage = require('../shop/cncoinStorage');
let db = require('./db');

async function init() {
    let flag, idx = 0;
    console.log('\n\n正在同步cncoin');

    console.log(`${++idx}.开始同步商品列表.`);

    flag = await db.needUpdate('cncoin_goods');
    if (flag) {
        let goodsList = await read.getGoodsList();
        await save.saveGoods(goodsList);
        await db.setCrawlerStatus('cncoin_goods');
    }

    let maxId = await read.getMaxGoodsId();

    console.log(`${++idx}.开始同步商品详情.`);
    flag = await db.needUpdate('cncoin_goods_detail');
    if (flag) {
        let goodsDetail = await read.getDetail(maxId);
        await save.saveDetail(goodsDetail);
        await db.setCrawlerStatus('cncoin_goods_detail');
    }

    console.log(`${++idx}.开始同步库存信息.`);
    flag = await db.needUpdate('cncoin_storage');
    if (flag) {
        let storages = await storage.getStorageById(maxId);
        await save.saveStorage(storages);
        await db.setCrawlerStatus('cncoin_storage');
    }

    // 数据较多的接口中，拿到数据后需同时存储至数据库，这样出错后，大量数据无需重复获取及后续处理
    console.log(`${++idx}.同步商品交易记录.`);

    flag = await db.needUpdate("cncoin_trade");
    if (flag) {
        await read.handleTradeRecord(maxId).catch(e => { console.log(e) });
        await db.setCrawlerStatus('cncoin_trade');
    }

    console.log(`${++idx}.同步评论记录.`);
    flag = await db.needUpdate("cncoin_comment");
    if (flag) {
        await read.handleComment(maxId).catch(e => { console.log(e) });
        await db.setCrawlerStatus('cncoin_comment');
    }

    console.log(`${++idx}.同步咨询记录---用户咨询/服务记录.`);
    flag = await db.needUpdate('cncoin_question');
    if (flag) {
        await read.handleQuestionList(maxId).catch(e => { console.log(e) });
        await db.setCrawlerStatus('cncoin_question');
    }

    console.log('cncoin数据增量备份完毕\n');
}

async function asyncData() {
    // 同步交易记录-数据存储至本地JSON
    // await cncoin.getTradeRecord();

    // 同步咨询信息-数据存储至本地JSON
    // await cncoin.getQuestion();

    // 同步评论信息-数据存储至本地JSON
    // await cncoin.getComment();

    // id号 68 121 72 无法顺利读取，需特殊处理
    // await cncoin.handleSpecialComment();

    // 分割评论信息 已完成-数据存储至本地JSON
    // await cncoin.splitComment();

    // 分割咨询信息-数据存储至本地JSON
    // await cncoin.splitQuestion();

    // 分割咨询回复-数据存储至本地JSON
    // await cncoin.splitAnswer();

    //读取评论得分信息-数据存储至本地JSON
    // await cncoin.getCommentScore();

    //读取用户咨询NLP得分信息-数据存储至本地JSON
    // await cncoin.getQuestionScore();

    // 读取客服回答NLP得分-数据存储至本地JSON
    // await cncoin.getAnswerScore();

    // 库存测试 -数据存储至本地JSON
    // await storage.getStorage();
}

async function save2DB() {

    // 存储商品列表
     await save.saveGoods().catch(e => { console.log(e) });

    //存储评论信息(已完结)
     await save.saveComment().catch(e => { console.log(e) });

    // 存储库存信息(需要载入历史数据)
    // await save.saveStorage().catch(e => { console.log(e) });

    // 存储商品属性
     await save.saveDetail().catch(e => { console.log(e) });

    // 交易记录
    await save.saveTradeRecord()
    .catch(e => {
        console.log(e);
    })

    // 咨询
    await save.saveQuestion()
        .catch(e => {
            console.log(e);
        });

    // 咨询问答分词
     await save.saveQuestionSeg().catch(e => { console.log(e) });

    // 咨询问答NLP
     await save.saveQuestionNlp().catch(e => { console.log(e) });

    // 评论分词
     await save.saveCommentSeg().catch(e => { console.log(e) });

    // 评论Nlp
    await save.saveCommentNlp().catch(e => { console.log(e) });
}

// 添加初始数据
async function loadDefault() {
    await save2DB();
}

module.exports = {
    loadDefault,
    init
};