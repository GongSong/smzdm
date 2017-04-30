/**
 * 各店铺统计数据json生成
 */

let util = require('../util/common');
let query = require('../../schema/mysql');
let sql = require('../../schema/sql');
let fs = require('fs');

// 存储统计数据至本地
async function saveJson2Disk(data, name) {
    let fileName = util.getMainContent() + '/controller/staticData/' + name + '.json';
    fs.writeFileSync(fileName, JSON.stringify(data), 'utf8');
}

async function setStaticData() {
    let staticSql = sql.static;
    let nameList = Object.keys(staticSql);

    // 最近一次更新过的接口
    let staticList = await query(sql.query.static_need_update);

    let rec_date = util.getNow();
    for (let i = 0; i <= nameList.length; i++) {
        let key = nameList[i];

        // 当前接口是否需要更新
        let needUpdate = staticList.filter(item => item.tbl_name == 'static_' + key);
        if (!needUpdate.length) {
            let data = await query(staticSql[key]);
            await saveJson2Disk({ rec_date, data }, key);

            // 记录已同步状态
            await query(sql.query.set_static_status.replace('?', key));
        }
    }
    console.log('接口本地数据同步完毕')
}

module.exports = {
    setStaticData
}