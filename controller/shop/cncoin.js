let axios = require('axios');
let parser = require('../util/htmlParser');
let query = require('../../schema/mysql');
let sql = require('../../schema/sql');
let coinStorage = require('./cncoinStorage').getStorage;

let fs = require('fs');

let spiderSetting = require('../util/spiderSetting');

let util = require('../util/common');

let cncoinDb = require('../db/cncoin');

// 数据增量存储，为回忆采集速度,pagesize = 50
let PAGESIZE = 50;

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

async function getGoodsList() {
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
    return goodsList;
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

async function getDetail(maxId) {
    // let goodsList = require('../data/cncoinGoodsList.json');
    // let MAX_NUM = goodsList.length;
    let goodsInfo = [];
    let minId = await query(sql.query.cncoin_detail_maxid);
    minId = minId[0].item_id + 1;

    for (let i = minId; i <= maxId; i++) {
        let result = await getDetailById(i);
        goodsInfo.push(result);
    }
    return goodsInfo;
}

// 获取交易记录
function getTradeRecordById(goodsId, pageNo = 1, loopTimes = 0) {

    // console.log(`正在抓取，商品id：${goodsId},页码:${pageNo}/${loopTimes}`);
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
            return {
                count: record.count,
                data: []
            };
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
        return {
            data,
            count: record.count
        };
    })
}

// 由于任务较多，该函数仅在task中启动，不在浏览器中显示（否则会因请求超时再次加载）
async function handleTradeRecord(maxId, startId = 1) {
    let dataList = await query(sql.query.cncoin_trade_list);
    let recordInfo = [];
    for (let i = startId; i <= maxId; i++) {
        let latestData = dataList.filter(item => item.item_id == i);
        let record = await getTradeDetail({ id: i, last: latestData });
        await cncoinDb.saveTradRecordByRecord(record);
        recordInfo.push(record);
    }
    return recordInfo;
}

async function getTradeRecord(maxId, startId = 1) {
    saveData2Content('Record', getTradeRecordById);
}

// 增量获取交易记录，数据同步速度优化
async function getTradeDetail(settings) {
    let loopTimes = 1;
    let recordList = [];

    // 如果lastDate为空，说明数据库中未存储该商品信息，应该全部抓取所有记录
    let lastDate = false;
    if (settings.last.length) {
        lastDate = settings.last[0].last_date;
        console.log(`商品${settings.id}最近更新日期:${lastDate}`);
    }

    for (var i = 1; i <= loopTimes; i++) {
        let record = await getTradeRecordById(settings.id, i, loopTimes);
        loopTimes = Math.ceil(record.count / PAGESIZE);
        recordList = [...recordList, ...record.data];
        if (lastDate) {
            // 如果lastDate不为空，数据库中记录过相关信息，此时只读取数据增量
            let addedRecord = recordList.filter(item => item.access_date > lastDate);

            // 新增的数据条数为PAGESIZE整数倍，说明当前取到的前 i 页全部为新增销售记录，应继续获取
            let modNum = addedRecord.length % PAGESIZE;

            if (addedRecord.length == 0) {
                // 如果新接连的数据条数为0，说明该商品在当前工作日未新增销售记录，后续页面无需读取
                return addedRecord;
            } else if (modNum < PAGESIZE && modNum > 0) {
                // 如果在当前 PAGESIZE条数据中找到上一次查询结果
                return addedRecord;
            }
        }
    }

    return recordList;
}

// 根据id获取单件商品数据列表
async function getDataList(goodsId, detailFunc, pageNo = 1) {
    let recordCount = await detailFunc(goodsId);
    let loopTimes = Math.ceil(recordCount.count / PAGESIZE);

    let recordList = [];

    for (var i = 1; i <= loopTimes; i++) {
        let record = await detailFunc(goodsId, i, loopTimes);
        recordList = [...recordList, ...record.data];
    }

    return recordList;
}

//将对应数据存到指定目录
async function saveData2Content(content, detailFunc, startId = 1) {
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;

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
            return {
                count: record.count,
                data: []
            };
        }
        // 获取评论详情，需要做字段转换
        return {
            count: record.count,
            data: parser.cncoin.question(record.recordList, goodsId)
        };
    })
}

async function getQuestion(startId = 1) {
    saveData2Content('Question', getQuestionById);
}

// 增量获取用户咨询记录，数据同步速度优化
async function getQuestionDetail(settings) {
    let loopTimes = 1;
    let recordList = [];

    // 如果lastDate为空，说明数据库中未存储该商品信息，应该全部抓取所有记录
    let lastDate = false;
    if (settings.last.length) {
        lastDate = settings.last[0].last_date;
        console.log(`商品${settings.id}最近更新日期:${lastDate}`);
    }

    for (var i = 1; i <= loopTimes; i++) {
        let record = await getQuestionById(settings.id, i, loopTimes);
        loopTimes = Math.ceil(record.count / PAGESIZE);
        recordList = [...recordList, ...record.data];
        if (lastDate) {
            // 如果lastDate不为空，数据库中记录过相关信息，此时只读取数据增量
            let addedRecord = recordList.filter(item => item.postTime > lastDate);

            // 新增的数据条数为PAGESIZE整数倍，说明当前取到的前 i 页全部为新增销售记录，应继续获取
            let modNum = addedRecord.length % PAGESIZE;

            if (addedRecord.length == 0) {
                // 如果新接连的数据条数为0，说明该商品在当前工作日未新增销售记录，后续页面无需读取
                return addedRecord;
            } else if (modNum < PAGESIZE && modNum > 0) {
                // 如果在当前 PAGESIZE条数据中找到上一次查询结果
                return addedRecord;
            }
        }
    }

    return recordList;
}


// 增加备份用户咨询信息
async function handleQuestionList(maxId) {

    let dataList = await query(sql.query.cncoin_question_maxid);

    // 测试模式
    // maxId = 1;

    for (let i = 1; i <= maxId; i++) {
        let latestData = dataList.filter(item => item.item_id == i);

        //测试数据
        // latestData = [{ last_date: '2017-03-05 15:30:01' }];

        let record = await getQuestionDetail({ id: i, last: latestData });
        // 咨询内容入库
        await cncoinDb.saveQuestionByRecord(record);

        // 问题分词
        let question = await splitQuestionByRecord(record, 'content');
        // 问题入库
        await cncoinDb.saveQuestionSegByRecord(question, 'content');
        // 回答分词
        question = await splitQuestionByRecord(record, 'replyContent');
        // 回答入库
        await cncoinDb.saveQuestionSegByRecord(question, 'replyContent');

        // 问题NLP
        let score = await getQuestionScoreByRecord(record, 'content');
        // 入库
        await cncoinDb.saveQuestionNlpByRecord(score, 'content');
        // 回答 NLP
        score = await getQuestionScoreByRecord(record, 'replyContent');
        // 入库
        await cncoinDb.saveQuestionNlpByRecord(score, 'replyContent');
    }
}

async function splitQuestionByRecord(comments, type) {

    let commentCount = comments.length;

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
            console.log(`商品${item.item_id},第${j+1}/${commentCount}条评论分词完毕\n`);
        }).catch(e => {
            console.log(e);
        });
    }
    return results;
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

async function handleComment(maxId, startId = 1) {
    let dataList = await query(sql.query.cncoin_comment_maxid);

    // 评论内容增加较少，通过测试模式测试数据读写流程正常
    // let isTestMode = true;

    // if (isTestMode) {
    //     maxId = 1;
    // }

    for (let i = startId; i <= maxId; i++) {
        if (i == 68 || i == 72 || i == 121) {
            continue;
        }
        let record = {};
        let loopTimes = 1;

        let recordList = [];

        // 当前id商品最近一次评论信息
        let lastData = dataList.filter(item => item.item_id == i);
        let maxCommentId = lastData.length ? lastData[0].comment_id : 0;

        // if (isTestMode) {
        //     maxCommentId = 10000;
        // }

        console.log(`商品${i}评论最大id:${maxCommentId}`);

        for (let k = 1; k <= loopTimes; k++) {
            record = await getCommentById(i, k, loopTimes);
            loopTimes = Math.ceil(record.count / PAGESIZE);
            if (maxCommentId) {
                // 如果maxCommentId不为空，数据库中记录过相关信息，此时只读取数据增量

                let addedRecord = record.data.filter(item => item.comment_id > maxCommentId);
                // 新增的数据条数为PAGESIZE整数倍，说明当前取到的前 i 页全部为新增销售记录，应继续获取
                let modNum = addedRecord.length % PAGESIZE;

                if (addedRecord.length == 0 || (modNum < PAGESIZE && modNum > 0)) {
                    // 如果新接连的数据条数为0，说明该商品在当前工作日未新增销售记录，后续页面无需读取
                    // 如果在当前 PAGESIZE条数据中找到上一次查询结果
                    record.data = addedRecord;
                    loopTimes = 1;
                }
            }
            recordList = [...recordList, ...record.data];
        }
        record.data = recordList;
        // 此时 record内为一件商品的增量同步信息
        await cncoinDb.saveCommentByRecord(record);

        // 分词并入库
        let segList = await segOneComment(record);
        await cncoinDb.saveCommentSegByRecord(segList);

        // nlp处理
        let nlpList = await getCommentScoreByComments(record);
        await cncoinDb.saveCommentNlpByRecord(nlpList);
        console.log('评论数据同步完毕');
    }
}

async function getCommentDetail(goodsId) {
    let records = await getCommentById(goodsId);
    let loopTimes = Math.ceil(records.count / PAGESIZE);

    let recordList = [];

    for (var i = 1; i <= loopTimes; i++) {
        let record = await getCommentById(goodsId, i, loopTimes);
        recordList = [...recordList, ...record.data];
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
        Reflect.deleteProperty(record, 'goodsIdV');
        record.item_id = goodsId;
        // 如果只是获取评论总数
        if (pageNo == 0) {
            return record;
        }
        // 获取评论详情，需要做字段转换
        record.data = parser.cncoin.comment(record.recordList, goodsId);
        Reflect.deleteProperty(record, 'recordList');
        return record;
    })
}

async function saveJson2Disk(content, data, i) {
    let fileName = util.getMainContent() + '/controller/data/cncoin' + content + '/itemid_' + i + '.json';
    fs.writeFileSync(fileName, JSON.stringify(data), 'utf8');
}

async function segOneComment(comments) {
    let commentCount = comments.data.length;
    let results = [];

    for (let j = 0; j < commentCount; j++) {
        let item = comments.data[j];

        await util.wordSegment(item.content).then(response => {
            results.push({
                detail: item.content,
                item_id: item.item_id,
                tokens: response.tokens,
                combtokens: response.combtokens,
                comment_id: item.comment_id
            });
            console.log(`商品${comments.item_id},第${j + 1}/${commentCount}条评论分词完毕\n`);
        }).catch(e => {
            console.log(e);
        });
    }

    return results;
}

async function splitComment() {

    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;

    let start = 1;

    for (let i = start; i <= MAX_NUM; i++) {
        let comments = cncoinDb.getCommentById(i);
        let results = await segOneComment(comments);
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
        let results = splitQuestionByRecord(comments, type);
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

async function getCommentScoreByComments(comments) {
    let commentCount = comments.data.length;

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
            console.log(`商品${item.item_id},第${j+1}/${commentCount}条评论情绪分析完毕\n`);
        }).catch(e => {
            console.log(e);
        });
    }

    return results;
}

async function getCommentScore(req, res) {

    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;

    let start = 1;
    // MAX_NUM = 1;

    for (let i = start; i <= MAX_NUM; i++) {
        let comments = cncoinDb.getCommentById(i);
        let results = getCommentScoreByComments(comments);
        saveJson2Disk('CommentScore', results, i);
        console.log(`第${i}/${MAX_NUM}条数据读取完毕\n`);
    }
}

async function getQuestionScoreByRecord(comments, type) {
    let results = [];
    let commentCount = comments.length;
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
            console.log(`商品${item.item_id},第${j+1}/${commentCount}条咨询情绪分析完毕\n`);
        }).catch(e => {
            console.log(e);
        });
    }
    return results;
}

async function getQuestionScore(type = 'content', saveTo = 'QuestionScore') {

    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;

    let start = 1;
    // MAX_NUM = 1;

    for (let i = start; i <= MAX_NUM; i++) {
        let comments = cncoinDb.getCommentById(i, 'Question');
        let results = getQuestionScoreByRecord(comments, type);
        saveJson2Disk(saveTo, results, i);
        console.log(`第${i}/${MAX_NUM}条数据读取完毕\n`);
    }
}

function getAnswerScore() {
    getQuestionScore('replyContent', 'AnswerScore');
}

async function getMaxGoodsId() {
    let data = await query(sql.query.cncoin_maxid);
    return data[0].item_id;
}

module.exports = {
    getGoodsList,
    getDetail,
    getTradeRecord,

    //非结构化数据
    getQuestion,
    getComment,
    handleSpecialComment,

    getStorage,

    //segment
    splitComment,
    splitQuestion,
    splitAnswer,

    //nlp
    getCommentScore,
    getQuestionScore,
    getAnswerScore,

    // 持续化数据获取所需各类id
    getMaxGoodsId,

    // 交易记录增量读写
    handleTradeRecord,
    handleComment,
    handleQuestionList
};