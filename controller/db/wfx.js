let query = require('../../schema/mysql.js')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql.js')
let util = require('../util/common')

// 从json取数据
function setStockData(req, res) {
    let arr = require('../data/wfx_shenyang.json')
    let spiderData = {
        data: arr
    }
    let sqlStr = sqlParser.handleWfxStockData(spiderData)
    query(sqlStr, function (result) {
        let str = JSON.stringify(result)
        res.send(str)
    })
}

// 从mysql取数
function getGoodList(req, res, next) {
    let sqlStr = sql.query.wfx_itemid_list
    query(sqlStr, function (result) {
        let data = JSON.stringify(result)
        data = JSON.parse(data);
        next(data);
    })
}

async function insertData(sql) {
    return await query(sql, function (result) {
        let string = JSON.stringify(result)
        return string;
    });
}

//  评论数据入库
function setCommentData(req, res) {
    let data = require('../data/wfx_comment.json');
    let result = [];
    data.forEach(comment => {
        let itemid = undefined;
        comment.forEach(item => {
            let _itemid = Reflect.get(item, 'item_id');
            if (itemid === undefined && _itemid != undefined) {
                itemid = _itemid;
            }
            if (_itemid === undefined && itemid != undefined) {
                Reflect.set(item, 'item_id', itemid);
            }
            Reflect.deleteProperty(item, 'type');
            Reflect.deleteProperty(item, 'status');
            Reflect.deleteProperty(item, 'order_show_id');
            Reflect.deleteProperty(item, 'mobile');
            result.push(item);
        });
    });

    // 添加将评论结果入库逻辑
    let promises = result.forEach((comment, i) => {
        console.log('正在插入第' + (i + 1) + '条数据');
        let sqlStr = sqlParser.handleWfxCommentList(comment);
        return insertData(sqlStr);
    });
    Promise.all(promises).then(item => {
        res.json({
            msg: '所有数据插入完毕'
        });
    });
}

//  评论分词结果入库
function setCommentSplitData(req, res) {
    let comment = require('../data/wfx_comments_split.json');
    let tokens = [],
        combtokens = [];
    comment.forEach((item, i) => {
        if (!Reflect.has(item, 'tokens')) {
            console.log('第' + i + '条token数据未读取，id:' + item.comment_id);
            return;
        }
        let oneToken = item.tokens.map(token => {
            return {
                item_id: item.item_id,
                comment_id: item.comment_id,
                word: token.word,
                wtype: token.wtype
            };
        });
        tokens.push(oneToken);

        if (!Reflect.has(item, 'combtokens')) {
            console.log('第' + i + '条combtokens数据未读取，id:' + item.comment_id);
            return;
        }
        item.combtokens.forEach(token => {
            if (token == null) {
                return;
            }
            combtokens.push({
                item_id: item.item_id,
                comment_id: item.comment_id,
                word: token.word
            });
        });
    });

    // 添加入库逻辑
    res.json({
        combtokens, // 表单一
        tokens // 表单二
    });
}

// 评分分数入库
function setCommentScore(req, res) {
    let comment = require('../data/wfx_comments_score.json');

    let score = comment.map(item => {
        return {
            item_id: item.item_id,
            comment_id: item.comment_id,
            negative: item.negative,
            positive: item.positive
        }
    });

    // 添加入库逻辑
    res.json(score);
}

module.exports = {
    setStockData,
    getGoodList,
    setCommentData,
    setCommentSplitData,
    setCommentScore
}