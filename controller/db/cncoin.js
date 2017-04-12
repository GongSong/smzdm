let query = require('../../schema/mysql.js')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql.js')

let fs = require('fs');
let util = require('../util/common');

function getCommentById(i = 1, content = 'Comment') {

    let fileName = util.getMainContent() + '/controller/data/cncoin' + content + '/itemid_' + i + '.json';

    let str = fs.readFileSync(fileName, 'utf-8');
    let comment = JSON.parse(str);
    return comment;
}

async function saveComment() {
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let start = 1;

    // MAX_NUM = 1;

    for (let i = start; i <= MAX_NUM; i++) {

        let comments = getCommentById(i);

        let sqlStr = sqlParser.handleCncoinCommentStat(comments);

        await query(sqlStr, function(result) {
            console.log(`第${i}/${MAX_NUM}条商品评论统计信息插入完毕`);
            console.log(result);
        })

        let commentCount = comments.data.length;

        if (commentCount == 0) {
            continue;
        }

        for (let j = 0; j < commentCount; j++) {
            let item = comments.data[j];
            sqlStr = sqlParser.handleCncoinCommentList(item);
            await query(sqlStr, function(result) {
                console.log(`第${i}条商品 第${j+1}/${commentCount}条 评论插入完毕\n`);
            })
        }
    }
    console.log(`共${MAX_NUM}条信息插入完毕`);
}

async function saveGoods() {
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let start = 0;
    for (let i = start; i < MAX_NUM; i++) {
        let item = goodsList[i];
        let sqlStr = sqlParser.handleCncoinGoodsList(item);
        await query(sqlStr, function(res) {
            console.log(`第${i+1}/${MAX_NUM}条 商品数据插入完毕\n`);
        });
    }
}

async function saveStorage() {
    // 获取今天数据并存储
    let storage = require('../data/cncoinStorage/' + util.getNow(8) + '.json');
    let MAX_NUM = storage.length;
    if (MAX_NUM == 0) {
        return;
    }
    for (let i = 0; i < MAX_NUM; i++) {
        let sqlStr = sqlParser.handleCncoinStorage(storage[i]);
        await query(sqlStr, function(res) {
            console.log(`第${i+1}/${MAX_NUM}条 商品数据插入完毕\n`);
        });
    }
}

module.exports = {
    saveComment,
    getCommentById,
    saveGoods,
    saveStorage
}