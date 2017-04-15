let read = require('../shop/ccgold');
let save = require('../db/ccgold');

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
    // let goodsList = await read.getGoodsList();
    // await save.setGoodDetail(goodsList);
}

async function save2DB() {

}

module.exports = {
    asyncData,
    save2DB,
    init
};