let read = require('../shop/jd');
// let save = require('../db/jd');
let db = require('./db');

async function init() {
  // let flag = await db.needUpdate('ccgold_goods_detail');
  let flag = 1
  console.log('\n\n正在同步jd');
  if (flag) {
    let goodsList = await read.getGoodsList();
    console.log(goodsList);
    // await save.setGoodList(goodsList);
    // db.setCrawlerStatus('ccgold_goods_detail');
    return;
  }
  console.log('今日数据已上传，无需重复采集!\n');
}

module.exports = {
  init
};