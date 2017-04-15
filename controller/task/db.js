let settings = require('../../schema/config').mysql.database;
let fs = require('fs');
let util = require('../util/common');
let query = require('../../schema/mysql');

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
    })
}

async function init() {
    await dbInit();
}

module.exports = {
    init
};