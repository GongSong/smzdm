let query = require('../../schema/mysql')
let sqlParser = require('../util/sqlParser')
let sql = require('../../schema/sql')

let fs = require('fs');
let util = require('../util/common');

function getCommentById(i = 1, content = 'Comment') {
    let fileName = util.getMainContent() + '/controller/data/cncoin' + content + '/itemid_' + i + '.json';
    try {
        let str = fs.readFileSync(fileName, 'utf-8');
        let comment = JSON.parse(str);
        return comment;
    } catch (e) {
        console.log('第' + i + '条信息读取失败');
        return [];
    }
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

async function saveGoods(goodsList) {
    // let goodsList = require('../data/cncoinGoodsList.json');

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

async function saveStorage(storage) {
    // 获取今天数据并存储
    // let storage = require('../data/cncoinStorage/' + util.getNow(8) + '.json');

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

async function saveDetail(storage) {

    // let storage = require('../data/cncoinGoodsDetail.json');
    let MAX_NUM = storage.length;
    if (MAX_NUM == 0) {
        return;
    }
    for (let i = 0; i < MAX_NUM; i++) {
        let sqlStr = sqlParser.handleCncoinDetail(storage[i]);
        await query(sqlStr, function(res) {
            console.log(`第${i+1}/${MAX_NUM}条 商品数据插入完毕\n`);
        });
    }
}

// 存储单条商品销售记录
async function saveTradRecord(record) {
    // let goodsList = require('../data/cncoinGoodsList.json');
    // let MAX_NUM = goodsList.length;
    // let start = 1;

    // for (let i = start; i <= maxId; i++) {

    // let record = getCommentById(i, 'Record');
    let length = record.length;
    if (length == 0) {
        return;
    }

    for (let j = 0; j < length; j++) {
        let obj = record[j];
        if (Reflect.has(obj, 'areaid') && typeof obj.areaid != 'undefined' && obj.areaid.length > 6) {
            obj.areaid = obj.areaid.substr(obj.areaid.length - 5, 5);
        }
        let url = sqlParser.handleCncoinTrade(obj);
        await query(url);
        console.log(`第 ${j}/${length} 条商品销售信息插入完毕`);
    }
    // }
}

async function saveQuestion() {
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let start = 1;

    for (let i = start; i <= MAX_NUM; i++) {

        let Record = getCommentById(i, 'Question');
        let length = Record.length;
        if (length == 0) {
            continue;
        }

        for (let j = 0; j < length; j++) {
            let obj = Record[j];
            let url = sqlParser.handleCncoinQuestion(obj);
            await query(url);
        }
        console.log(`第${i}/${MAX_NUM}条商品咨询信息插入完毕`);
    }
}

async function saveQuestionSeg() {
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let start = 1;

    for (let i = start; i <= MAX_NUM; i++) {
        for (let type = 0; type <= 1; type++) {
            let Record = getCommentById(i, type ? 'AnswerSeg' : 'QuestionSeg');
            for (let k = 0; k < Record.length; k++) {
                let question = Record[k];
                if (!Reflect.has(question, 'tokens')) {
                    continue;
                }

                for (let j = 0; j < question.combtokens.length; j++) {
                    let cmb = question.combtokens[i];
                    if (typeof cmb == 'undefined') {
                        continue;
                    }
                    cmb.wtype = cmb.cls;
                    question.tokens.push(cmb);
                }

                for (let j = 0; j < question.tokens.length; j++) {
                    let item = question.tokens[j];
                    if (item == null) {
                        continue;
                    }
                    item.item_id = question.item_id;
                    item.replyTime = question.replyTime;
                    item.account = question.account;
                    item.postTime = question.postTime;
                    let url = sqlParser.handleCncoinQuestionSeg(item, type);
                    await query(url);
                }
            }
        }
        console.log(`第${i}/${MAX_NUM}条商品咨询NLP信息插入完毕`);
    }
}

async function saveQuestionNlp() {
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let start = 1;
    for (let i = start; i <= MAX_NUM; i++) {
        for (let type = 0; type <= 1; type++) {
            let Record = getCommentById(i, type ? 'AnswerScore' : 'QuestionScore');
            for (let k = 0; k < Record.length; k++) {
                let item = Record[k];
                if (!Reflect.has(item, 'positive')) {
                    continue;
                }
                let url = sqlParser.handleCncoinQuestionNlp(item, type);
                await query(url);
            }
        }
        console.log(`第${i}/${MAX_NUM}条商品咨询NLP信息插入完毕`);
    }
}

async function saveCommentSeg() {
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let start = 1;

    for (let i = start; i <= MAX_NUM; i++) {
        let Record = getCommentById(i, 'CommentSeg');
        for (let k = 0; k < Record.length; k++) {
            let question = Record[k];
            if (!Reflect.has(question, 'tokens')) {
                continue;
            }

            for (let j = 0; j < question.combtokens.length; j++) {
                let cmb = question.combtokens[i];
                if (typeof cmb == 'undefined') {
                    continue;
                }
                cmb.wtype = cmb.cls;
                question.tokens.push(cmb);
            }

            for (let j = 0; j < question.tokens.length; j++) {
                let item = question.tokens[j];
                if (item == null) {
                    continue;
                }
                item.item_id = question.item_id;
                item.comment_id = question.comment_id;
                let url = sqlParser.handleCncoinCommentSeg(item);
                await query(url);
            }
        }
        console.log(`第${i}/${MAX_NUM}条商品评论分词信息插入完毕`);
    }
}

async function saveCommentNlp() {
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let start = 1;
    for (let i = start; i <= MAX_NUM; i++) {

        let Record = getCommentById(i, 'CommentScore');
        for (let k = 0; k < Record.length; k++) {
            let item = Record[k];
            if (!Reflect.has(item, 'positive')) {
                continue;
            }
            let url = sqlParser.handleCncoinCommentNlp(item);
            await query(url);
        }

        console.log(`第${i}/${MAX_NUM}条商品咨询NLP信息插入完毕`);
    }
}

module.exports = {
    saveComment,
    getCommentById,
    saveGoods,
    saveStorage,
    saveDetail,
    saveTradRecord,
    saveQuestion,
    saveQuestionSeg,
    saveQuestionNlp,
    saveCommentSeg,
    saveCommentNlp
}