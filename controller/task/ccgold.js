let read = require('../shop/ccgold');
let db = require('../db/ccgold');

// // 初始化数据库
// function dbInit() {

// }

// // 添加初始数据
// function dbDataInit() {

// }

async function init() {
    await asyncData();
    await save2DB();
}

async function asyncData() {
    
    // 获取商品列表
    await read.getGoodsList();

    // 下钻获取商品列表
    // await cncoin.getGoodsDetail();

}

async function save2DB() {

    // 存储商品列表
    // await cncoinDb.saveGoods();

    //存储评论信息(已完结)
    // await cncoinDb.saveComment();

}

module.exports = {
    asyncData,
    save2DB,
    init
};