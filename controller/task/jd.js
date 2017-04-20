let read = require('../shop/jd');
let save = require('../db/jd');
let db = require('./db');

async function init() {
  let flag = await db.needUpdate('jd_goods');
  console.log('\n\n正在同步jd');
  if (flag) {
    let goodsList = await read.getGoodsList();
    console.log(goodsList);
   //  await save.setGoodList(goodsList);
   // db.setCrawlerStatus('jd_goods');
  }  
}

module.exports = {
  init
};