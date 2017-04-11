let query = require('../../schema/mysql.js')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql.js')

let fs = require('fs');
let util = require('../util/common');

function getCommentById(i = 1) {

    let content = 'Comment';
    let fileName = util.getMainContent() + '/controller/data/cncoin' + content + '/itemid_' + i + '.json';

    let str = fs.readFileSync(fileName, 'utf-8');
    let comment = JSON.parse(str);
    // console.log(typeof comment);
    // console.log(comment);
    // 此时数据读入至comment中，将评论中描述信息和评论内容分开
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

module.exports = {
    saveComment,
    getCommentById
}