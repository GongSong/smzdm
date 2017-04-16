let settings = require('../../schema/config').mysql.database;
let fs = require('fs');
let util = require('../util/common');
let query = require('../../schema/mysql');
let sqlStr = require('../../schema/sql');

// 初始化数据库
async function initDbByName(name) {
    let fileName = util.getMainContent() + '/schema/sqlInit/' + name + '.sql';
    let sqlList = fs.readFileSync(fileName, 'utf-8');
    sqlList = sqlList.split(';');
    for (let i = 0; i < sqlList.length; i++) {
        let sql = sqlList[i].trim();
        if (sql.length) {
            await query(sql, e => {
                console.log(e);
            });
        }
    }
}

async function dbInit() {
    let shopList = ['ccgold', 'wfx', 'youzan', 'cncoin'];
    shopList.forEach((item, i) => {
        // initDbByName(item);
        console.log(`${i+1}.数据库 ${item} 初始化完毕.请将以上语句取消注释`);
        // 此处四家店铺初始化语句中需删除导出语句的注释内容
    })
}

async function init() {
    await dbInit();
}

// 判断某一日的数据是否需要采集，用于库存、价格、销量等查询
async function needUpdate(sheetName, next) {
    let sql = sqlStr.query.need_update.replace('?', sheetName);
    let data = await query(sql);
    return data[0].need_update;
}

module.exports = {
    init,
    needUpdate
};