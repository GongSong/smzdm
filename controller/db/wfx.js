let query = require('../../schema/mysql');
let sqlParser = require('../util/sqlParser');
let sql = require('../../schema/sql');
let util = require('../util/common');

const COMBTOKEN_TYPE = '短语';
const IGNORE_TYPE = '标点符号';

// 从json取数据
async function setStockData(goodsList) {
    if (typeof goodsList == 'undefined') {
        goodsList = require('../data/wfx_shenyang.json');
    }
    let sqlStr = sqlParser.handleWfxStockData(goodsList)
    await query(sqlStr);
    console.log('wfx商品列表数据导入完毕')
}

// 从mysql取数
function getGoodList(req, res, next) {
    let sqlStr = sql.query.wfx_itemid_list
    query(sqlStr, function(result) {
        let data = JSON.stringify(result)
        data = JSON.parse(data);
        next(data);
    })
}

async function insertData(sql) {
    return await query(sql, function(result) {
        let string = JSON.stringify(result)
        return string;
    });
}

async function setOneCommentData(comment) {
    let result = [];
    comment.forEach(item => {
        Reflect.deleteProperty(item, 'type');
        Reflect.deleteProperty(item, 'status');
        Reflect.deleteProperty(item, 'order_show_id');
        Reflect.deleteProperty(item, 'mobile');
        result.push(item);
    });

    for (let i = 0; i < result.length; i++) {
        console.log(`正在插入第${i+1}条数据`);
        let sqlStr = sqlParser.handleWfxCommentList(result[i]);
        await query(sqlStr);
    }
}

//  评论数据入库
async function setCommentData(data) {
    if (typeof data == 'undefined') {
        data = require('../data/wfx_comment.json');
    }

    for (let i = 0; i < data.length; i++) {
        await setOneCommentData(data[i]);
        console.log(`wfx评论数据插入完毕,商品id:${i+1}`);
    }
}

//  评论分词结果入库
async function setCommentSplitData(comment) {
    if (typeof comment == 'undefined') {
        comment = require('../data/wfx_comments_split.json');
    }

    // 数据预处理
    let tokens = [];
    comment.forEach((item, i) => {
        if (typeof item == 'undefined' || !Reflect.has(item, 'tokens')) {
            console.log('第' + i + '条token数据未读取，id:' + item.comment_id);
            return;
        }

        let oneToken = item.tokens.map(token => {
            return {
                item_id: item.item_id,
                comment_id: item.comment_id,
                word: token.word,
                wtype: token.wtype,
                pos: token.pos
            };
        });

        oneToken.forEach((v, i) => {
            if (v.wtype !== IGNORE_TYPE) {
                tokens.push(v);
            }
        });

        if (!Reflect.has(item, 'combtokens')) {
            console.log('第' + i + '条combtokens数据未读取，id:' + item.comment_id);
            return;
        }
        item.combtokens.forEach(token => {
            if (token == null) {
                return;
            }
            tokens.push({
                item_id: item.item_id,
                comment_id: item.comment_id,
                word: token.word,
                wtype: COMBTOKEN_TYPE,
                pos: token.pos
            });
        });
    });

    // 添加入库逻辑
    for (let i = 0; i < tokens.length; i++) {
        console.log(`正在插入第${i}条数据`);
        let sqlStr = sqlParser.handleWfxCommentSeg(tokens[i]);
        await query(sqlStr);
    }
}

// 评分分数入库
async function setCommentScore(comment) {
    if (typeof comment == 'undefined') {
        comment = require('../data/wfx_comments_score.json');
    }
    // 数据预处理
    let score = comment.map(item => {
        return {
            item_id: item.item_id,
            comment_id: item.comment_id,
            negative: item.negative,
            positive: item.positive
        }
    });

    // 添加入库逻辑
    for (let i = 0; i < score.length; i++) {
        console.log(`正在插入第${i+1}条数据`);
        let sqlStr = sqlParser.handleWfxCommentNlp(score[i]);
        await query(sqlStr);
    }
}

// 营销数据入库
async function setDetail(comment) {
    if (typeof comment == 'undefined') {
        comment = require('../data/wfx_detail.json');
    }

    // 添加入库逻辑
    for (let i = 0; i < comment.length; i++) {
        if (comment[i] == null) {
            continue;
        }
        console.log(`正在插入第${i+1}条数据`);
        let sqlStr = sqlParser.handleWfxDetail(comment[i]);
        await query(sqlStr);
    }
}


module.exports = {
    setDetail,
    setStockData,
    getGoodList,
    setCommentData,
    setCommentSplitData,
    setCommentScore
}