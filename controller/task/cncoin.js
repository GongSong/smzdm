let cncoin = require('../shop/cncoin');

// 初始化数据库
function dbInit() {

}

// 添加初始数据
function dbDataInit() {

}

// 同步每日价格
function asyncPrice() {

}

// 同步库存信息
function asyncStorageNum() {

}

async function init() {
    await dbInit();
    await dbDataInit();
}

async function asyncData() {

    // 同步交易记录
    // await cncoin.getTradeRecord();

    // 同步评论信息
    // await cncoin.getQuestion();

    // 分割评论信息
    // await cncoin.splitComment();
}

module.exports = {
    asyncData,
    init
};