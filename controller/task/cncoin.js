let cncoin = require('../shop/cncoin');
let cncoinDb = require('../db/cncoin');
let cncoinStorage = require('../shop/cncoinStorage');

// 初始化数据库
function dbInit() {

}

// 添加初始数据
function dbDataInit() {

}

// // 同步每日价格
// function asyncPrice() {

// }

// // 同步库存信息
// function asyncStorageNum() {

// }

async function init() {
    await dbInit();
    await dbDataInit();
}

async function asyncData() {

    // 同步交易记录
    // await cncoin.getTradeRecord();

    // 同步咨询信息
    // await cncoin.getQuestion();

    // 同步评论信息
    // await cncoin.getComment();

    // id号 68 121 72 无法顺利读取，需特殊处理
    // await cncoin.handleSpecialComment();

    // 读取库存信息-接口信息有误
    // await cncoin.getStorage();

    // 分割评论信息 已完成
    // await cncoin.splitComment();

    // 分割咨询信息
    // await cncoin.splitQuestion();

    // 分割咨询回复
    // await cncoin.splitAnswer();

    //读取评论得分信息
    // await cncoin.getCommentScore();

    //读取用户咨询NLP得分信息
    // await cncoin.getQuestionScore();

    // 读取客服回答NLP得分
    // await cncoin.getAnswerScore();

    // 库存测试
    // await cncoinStorage.test1();

}

async function save2DB() {

    // 存储商品列表
    await cncoinDb.saveGoods();

    //存储评论信息(已完结)
    // await cncoinDb.saveComment();

}

module.exports = {
    asyncData,
    save2DB,
    init
};