let read = require('../shop/jd');
let save = require('../db/jd');
let db = require('./db');

async function init() {
    let flag = await db.needUpdate('jd_goods');
    console.log('\n\n正在同步jd');
    let goodsList = [];
    if (flag) {
        goodsList = await read.getGoodsList();
        // console.log(goodsList);
        await save.setGoodList(goodsList);
        db.setCrawlerStatus('jd_goods');
    }

    flag = await db.needUpdate('jd_comment');
    flag = 1;
    if (flag) {
        goodsList = goodsList.filter(item => item.totalCount > 0);
        await read.getComment(goodsList);
        db.setCrawlerStatus('jd_comment');
    }

}

module.exports = {
    init
};