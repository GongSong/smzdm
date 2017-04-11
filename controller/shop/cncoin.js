let axios = require('axios');
let parser = require('../util/htmlParser');

let coinStorage = require('./cncoinStorage').getStorage;

let fs = require('fs');

let spiderSetting = require('../util/spiderSetting');

let util = require('../util/common');

let cncoinDb = require('../db/cncoin');

let PAGESIZE = 3000;

// 获取商品主表信息
function getGoodsById(detail_id = 1) {
    console.log('正在抓取第' + detail_id + '页');
    let url = 'http://item.chinagoldcoin.net/getDetail'
    let config = {
        method: 'get',
        url,
        params: { detail_id },
        headers: spiderSetting.headers.cncoin
    }

    return axios(config).then(res => {
        let data = res.data;
        if (data.code !== '000002') {
            return {
                item_id: detail_id,
                status: 0
            };
        }
        return {
            price: data.msg.shopPrice,
            name: data.msg.goodsName,
            tips: data.msg.goodsNameLong,
            // 抽签预订信息，2017年4月2日更新完毕后增加功能
            // 抽签详情页面: http://yding.chinagoldcoin.net/detail/df6ba724a221647c7fe4287ef4a056f3.html
            reserveId: data.msg.reserveId,
            // 抽签预订结束时间
            reserveEnd: data.msg.reserveEnd,
            item_id: detail_id,
            rec_date: util.getNow()
        };

    }).catch(e => console.log(e));
}

async function getGoodsList(req, res) {
    let goodsList = [];
    let finished = false;

    // 当id自增到 code返回值不会000002时，到达id上限，无商品数据
    for (let i = 1; !finished; i++) {
        await getGoodsById(i)
            .then(data => {
                if (Reflect.has(data, 'status')) {
                    console.log('商品id' + i + '无详情数据');
                    finished = true;
                    return;
                }
                goodsList.push(data);
            })
    }
    res.json(goodsList);
}

function getDetailById(id = 1) {
    let url = `http://item.chinagoldcoin.net/product_detail_${id}.html`;
    console.log('正在抓取第' + id + '页');
    return axios.get(url).then(res => {
        let goodsInfo = parser.cncoin.goodsDetail(res.data);
        goodsInfo.item_id = id;
        console.log(goodsInfo);
        return goodsInfo;
    })
}

async function getDetail(req, res) {
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let goodsInfo = [];

    for (let i = 1; i < MAX_NUM; i++) {
        let result = await getDetailById(i);
        goodsInfo.push(result);
    }
    res.json(goodsInfo);
}

// 获取交易记录
function getTradeRecordById(goodsId, pageNo = 0, loopTimes = 0) {

    console.log(`正在抓取，商品id：${goodsId},页码:${pageNo}/${loopTimes}`);
    let config = {
        method: 'get',
        url: 'http://www.chinagoldcoin.net/views/newDetail/detail/new-more-buy.jsp',
        params: {
            goodsId,
            pageNo,
            pageSize: PAGESIZE
        }
    }

    return axios(config).then(res => {
        let record = res.data[0];
        // 如果只是获取评论总数
        if (pageNo == 0) {
            return record.count;
        }

        // 获取评论详情，需要做字段转换
        let data = record.recordList.map(item => {
            Reflect.deleteProperty(item, 'order_id');
            let obj = Object.assign({}, item);
            obj.areaid = item.departmentId;
            obj.item_id = goodsId;
            Reflect.deleteProperty(obj, 'departmentId');
            return obj;
        });
        return data;
    })
}

// 由于任务较多，该函数仅在task中启动，不在浏览器中显示（否则会因请求超时再次加载）

async function getTradeRecord(startId = 1) {
    saveData2Content('Record', getTradeRecordById);
}

// 根据id获取单件商品数据列表
async function getDataList(goodsId, detailFunc, pageNo = 1) {
    let recordCount = await detailFunc(goodsId);
    let loopTimes = Math.ceil(recordCount / PAGESIZE);

    let recordList = [];

    for (var i = 1; i <= loopTimes; i++) {
        let record = await detailFunc(goodsId, i, loopTimes);
        recordList = [...recordList, ...record];
    }

    return recordList;
}

//将对应数据存到指定目录
async function saveData2Content(content, detailFunc, startId = 1) {
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let recordInfo = [];

    for (let i = startId; i <= MAX_NUM; i++) {
        let record = await getDataList(i, detailFunc);
        saveJson2Disk(content, record);
        console.log(content + ':第' + i + '项数据写入完毕\n');
    }
}

// 获取咨询信息
function getQuestionById(goodsId, pageNo = 0, loopTimes = 0) {

    console.log(`正在抓取，商品id：${goodsId},页码:${pageNo}/${loopTimes}`);

    let config = {
        method: 'get',
        url: 'http://www.chinagoldcoin.net/views/newDetail/detail/new-more-zx.jsp',
        params: {
            goodsId,
            pageNo,
            pageSize: PAGESIZE
        }
    }

    return axios(config).then(res => {
        let record = res.data[0];
        // 如果只是获取评论总数
        if (pageNo == 0) {
            return record.count;
        }
        // 获取评论详情，需要做字段转换
        return parser.cncoin.question(record.recordList, goodsId);
    })
}

async function getQuestion(startId = 1) {
    saveData2Content('Question', getQuestionById);
}

// id:68/72/121 的用户评论信息无法读取
async function getBadListComment(id) {
    let typeList = ['middle', 'bad', 'image']; // good,all

    let result = await getCommentById(id, 0, 0, 'middle');

    let data = [];

    for (let i = 1; i < 3; i++) {
        let item = await getCommentById(id, 1, 0, typeList[i]);
        data = [...data, ...item];
    }
    result.data = data;
    return result;
}

async function handleSpecialComment() {
    let idList = [68, 72, 121];
    for (let i = 0; i < 3; i++) {
        let result = await getBadListComment(idList[i]);
        saveJson2Disk('Comment', result, i);
    }
    console.log('数据读取完成');
}

async function getComment(startId = 1) {

    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let recordInfo = [];

    /**
     * id =68 (5059条);id=72 (2741条);id= 121 (1318条)
     * 读取中评、差评、有晒单（好评无法读取）
     * good,middle,bad,image
     */
    for (let i = startId; i <= MAX_NUM; i++) {
        if (i == 68 || i == 72 || i == 121) {
            // 第68号无法读取出来
            return;
        }
        let record = await getCommentDetail(i);
        saveJson2Disk('Comment', record, i);
    }
}

async function getCommentDetail(goodsId) {
    let records = await getCommentById(goodsId);
    let loopTimes = Math.ceil(records.count / PAGESIZE);

    let recordList = [];

    for (var i = 1; i <= loopTimes; i++) {
        let record = await getCommentById(goodsId, i, loopTimes);
        recordList = [...recordList, ...record];
    }
    records.data = recordList;
    return records;
}

function getCommentById(goodsId, pageNo = 0, loopTimes = 0, type = 'all') {

    console.log(`正在抓取，商品id：${goodsId},页码:${pageNo}/${loopTimes}`);

    let config = {
        method: 'get',
        url: 'http://www.chinagoldcoin.net/views/newDetail/detail/new-more-pj.jsp',
        params: {
            goodsId,
            pageNo,
            pageSize: PAGESIZE,
            type
        }
    };

    return axios(config).then(res => {
        let record = res.data[0];
        // 如果只是获取评论总数
        if (pageNo == 0) {
            Reflect.deleteProperty(record, 'goodsIdV');
            Reflect.deleteProperty(record, 'recordList');
            record.item_id = goodsId;
            return record;
        }
        // 获取评论详情，需要做字段转换
        return parser.cncoin.comment(record.recordList, goodsId);
    })
}

async function saveJson2Disk(content, data, i) {
    let fileName = util.getMainContent() + '/controller/data/cncoin' + content + '/itemid_' + i + '.json';
    fs.writeFileSync(fileName, JSON.stringify(data), 'utf8');
}

async function splitComment() {

    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;

    let start = 1;

    for (let i = start; i <= MAX_NUM; i++) {
        let comments = cncoinDb.getCommentById(i);
        let commentCount = comments.data.length;
        if (commentCount == 0) {
            continue;
        }

        let results = [];

        for (let j = 0; j < commentCount; j++) {
            let item = comments.data[j];
            await util.wordSegment(item.detail).then(response => {
                comments.push({
                    detail: item.content,
                    item_id: item.item_id,
                    tokens: response.tokens,
                    combtokens: response.combtokens,
                    comment_id: item.comment_id
                });
                console.log(`商品${i},第${j + 1}/${commentCount}条评论分词完毕\n`);
            }).catch(e => {
                console.log(e);
            });
            // 延迟1000ms读取接口 | 通过  try...catch 后可不用延迟对接口的调用
            // await util.sleep(1000);
        }
        saveJson2Disk('CommentSeg', results, i);
        console.log(`第${i}/${MAX_NUM}条数据读取完毕\n`);
    }
}

/**
 * type = replyContent 时，处理回复 
 * type = content 时，处理提问 
 * @param {string} [type='content'] 
 */
async function splitQuestion(type = 'content', saveTo = 'QuestionSeg') {

    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;

    let start = 1;

    for (let i = start; i <= MAX_NUM; i++) {
        let comments = cncoinDb.getCommentById(i, 'Question');
        let commentCount = comments.length;
        if (commentCount == 0) {
            continue;
        }

        let results = [];

        for (let j = 0; j < commentCount; j++) {
            let item = comments[j];
            await util.wordSegment(item[type]).then(response => {
                    // 用 id/account/replyTime/PostTime来确定同一条请求
                    results.push({
                        detail: item[type],
                        item_id: item.item_id,
                        tokens: response.tokens,
                        combtokens: response.combtokens,
                        account: item.account,
                        replyTime: item.replyTime,
                        postTime: item.postTime
                    });
                    console.log(`商品${i},第${j+1}/${commentCount}条评论分词完毕\n`);
                }).catch(e => {
                    console.log(e);
                })
                // 延迟1000ms读取接口 | 通过  try...catch 后可不用延迟对接口的调用
                // await util.sleep(1000);
        }
        saveJson2Disk(saveTo, results, i);
        console.log(`第${i}/${MAX_NUM}条数据读取完毕\n`);
    }
}

function splitAnswer() {
    splitQuestion('replyContent', 'AnswerSeg');
}

async function getStorage() {
    let data = await coinStorage();
    let fileName = util.getMainContent() + '/controller/data/cncoinStorageTest.json';
    fs.writeFileSync(fileName, JSON.stringify(data), 'utf8');
    console.log('json数据写入磁盘完毕');
}

async function getCommentScore(req, res) {

    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;

    let start = 1;
    // MAX_NUM = 1;

    for (let i = start; i <= MAX_NUM; i++) {
        let comments = cncoinDb.getCommentById(i);
        let commentCount = comments.data.length;
        if (commentCount == 0) {
            continue;
        }

        let results = [];

        for (let j = 0; j < commentCount; j++) {
            let item = comments.data[j];
            await util.getNegativeWords(item.content).then(response => {
                results.push({
                    item_id: item.item_id,
                    comment_id: item.comment_id,
                    negative: response.negative,
                    positive: response.positive
                });
                console.log(`商品${i},第${j+1}/${commentCount}条评论情绪分析完毕\n`);
            }).catch(e => {
                console.log(e);
            });
            // 延迟1000ms读取接口 | 通过  try...catch 后可不用延迟对接口的调用
            // await util.sleep(1000);
        }
        saveJson2Disk('CommentScore', results, i);
        console.log(`第${i}/${MAX_NUM}条数据读取完毕\n`);
    }
}

async function getQuestionScore(type = 'content', saveTo = 'QuestionScore') {

    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;

    let start = 1;
    // MAX_NUM = 1;

    for (let i = start; i <= MAX_NUM; i++) {
        let comments = cncoinDb.getCommentById(i, 'Question');
        let commentCount = comments.length;
        if (commentCount == 0) {
            continue;
        }

        let results = [];

        for (let j = 0; j < commentCount; j++) {
            let item = comments[j];
            await util.getNegativeWords(item[type]).then(response => {
                results.push({
                    detail: item[type],
                    item_id: item.item_id,
                    account: item.account,
                    replyTime: item.replyTime,
                    postTime: item.postTime,
                    negative: response.negative,
                    positive: response.positive
                });
                console.log(`商品${i},第${j+1}/${commentCount}条咨询情绪分析完毕\n`);
            }).catch(e => {
                console.log(e);
            });
            // 延迟1000ms读取接口 | 通过  try...catch 后可不用延迟对接口的调用
            // await util.sleep(1000);
        }
        saveJson2Disk(saveTo, results, i);
        console.log(`第${i}/${MAX_NUM}条数据读取完毕\n`);
    }
}

function getAnswerScore() {
    getQuestionScore('replyContent', 'AnswerScore');
}

module.exports = {
    getGoodsList,
    getDetail,
    getTradeRecord,
    getQuestion,
    getComment,
    handleSpecialComment,
    getStorage,
    splitComment,
    splitQuestion,
    splitAnswer,
    getCommentScore,
    getQuestionScore,
    getAnswerScore
};