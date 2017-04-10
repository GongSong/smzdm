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

// 同步交易记录
function asyncTradeRecord() {
    cncoin.getTradeRecord();
}

// 同步评论信息
function asyncComment() {

}

async function init() {
    await dbInit();
    await dbDataInit();
}

async function asyncData() {
    await asyncTradeRecord();
}

module.exports = {
    asyncData,
    init
};