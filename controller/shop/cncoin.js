let axios = require('axios');
let parser = require('../util/htmlParser');

let fs = require('fs');

let spiderSetting = require('../util/spiderSetting');
let dbResult = require('../db/wfx');

let util = require('../util/common');

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

async function getRecordDetail(goodsId, pageNo = 1) {
    let recordCount = await getTradeRecordById(goodsId);
    let loopTimes = Math.ceil(recordCount / PAGESIZE);

    let recordList = [];

    for (var i = 1; i <= loopTimes; i++) {
        let record = await getTradeRecordById(goodsId, i, loopTimes);
        recordList = [...recordList, ...record];
    }

    return recordList;
}

// 获取交易记录
// 将url换为http://www.chinagoldcoin.net/views/newDetail/detail/new-more-zx.jsp?pageNo=3&pageSize=20&goodsId=68 时则获取评论记录
function getTradeRecordById(goodsId, pageNo = 0, loopTimes = 0) {

    console.log(`正在抓取，商品id：${goodsId},页码:${pageNo}/${loopTimes}`);

    let params = {
        goodsId,
        pageNo,
        pageSize: PAGESIZE
    };

    let url = 'http://www.chinagoldcoin.net/views/newDetail/detail/new-more-buy.jsp'

    let config = {
        method: 'get',
        url,
        params,
    }

    let data = [];

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
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let recordInfo = [];

    for (let i = startId; i <= MAX_NUM; i++) {
        let record = await getRecordDetail(i);
        let fileName = process.cwd() + '\\controller\\data\\cncoinRecord\\itemid_' + i + '.json';
        fs.writeFileSync(fileName, JSON.stringify(record), 'utf8');
        console.log('第' + i + '项数据写入完毕\n');
    }
    console.log('cncoin全部交易记录数据写入完成');
}

// async function getCommentById(item_id, page = 1) {

//     console.log('正在抓取第' + page + '页');
//     let url = 'http://www.symint615.com/Item/getItemComment';
//     let config = {
//         method: 'get',
//         url,
//         params: {
//             item_id,
//             p: page
//         },
//         headers: spiderSetting.headers.wfx
//     };

//     return await axios(config).then(res => {
//         let comments = res.data;
//         // 如果当前页无数据或小于每页最大产品数量10，则表示下一页无数据
//         if (typeof comments.data.length == 0) {
//             return [];
//         } else if (comments.data.length < 10) {
//             return parser.wfx.commentInfo(comments.data);
//         }
//         return getCommentById(item_id, page + 1)
//             .then(res => {
//                 // 2017年接口升级后，第2页以后的评论返回结果非标准json格式，即内容没在 res.data中，而是直接返回 array结果。
//                 if (typeof res.data != 'undefined') {
//                     res = res.data.data;
//                 }
//                 return parser.wfx.commentInfo([...comments.data, ...res]);
//             });
//     }).catch(e => console.log(e));
// }

// function getComment(req, res) {

//     let testMode = false;

//     dbResult.getGoodList(req, res, (data) => {
//         if (!testMode) {
//             let promises = data.map(item => getCommentById(item.item_id));
//             Promise.all(promises)
//                 .then(result => {
//                     // 去除空数据
//                     let arr = [];
//                     result.forEach(item => {
//                         if (item == null) {
//                             return;
//                         }
//                         if (JSON.stringify(item) != '[]') {
//                             arr.push(item);
//                         }
//                     })
//                     res.send(arr);
//                 })
//         } else {
//             getCommentById(data[7].item_id).then(result => {
//                 res.send(result);
//             })
//         }
//     })
// }

// // 用node-segment分词并做词性处理
// function splitCommentBySegment(req, res) {
//     let data = require('../data/wfx_comment.json');
//     let result = [];

//     data.forEach(comment => {
//         comment.forEach(item => {
//             let segText = segment.doSegment(item.detail, {
//                 stripPunctuation: true
//             });
//             result.push(Object.assign(util.handleWordSegment(segText), {
//                 item_id: item.item_id,
//                 detail: item.detail
//             }));
//         });
//     });

//     res.json(result);
// }

// async function splitComment(req, res) {
//     let data = require('../data/wfx_comment.json');
//     let result = [];

//     data.forEach(comment => {
//         comment.forEach(item => {
//             result.push(item);
//         });
//     });

//     let comments = [];

//     // 按序号依次读取数据，降低接口请求频次，必要时应增加延时
//     // 用for循环同步执行，即在await完成之后才执行 i++
//     // 用forEach/map等遍历函数，其回调函数不能是 async函数，无法在其中使用await,数据将被异步执行
//     for (let i = 0; i < result.length; i++) {
//         let item = result[i];
//         await util.wordSegment(item.detail).then(response => {
//             comments.push({
//                 detail: item.detail,
//                 item_id: item.item_id,
//                 tokens: response.tokens,
//                 combtokens: response.combtokens,
//                 comment_id: item.order_item_id
//             });
//         })
//         console.log('第' + i + '条数据读取完毕\n');
//     }
//     res.json(comments);
// }

// async function getCommentScore(req, res) {
//     let data = require('../data/wfx_comment.json');
//     let result = [];

//     data.forEach(comment => {
//         comment.forEach(item => {
//             result.push(item);
//         });
//     });

//     let scores = [];

//     for (let i = 0; i < result.length; i++) {
//         let item = result[i];
//         await util.getNegativeWords(item.detail).then(obj => {
//             obj.text = item.detail;
//             obj.item_id = item.item_id;
//             obj.comment_id = item.order_item_id;
//             scores.push(obj);
//             console.log(obj);
//         })
//         console.log('第' + i + '条数据读取完毕\n');
//     }
//     res.json(scores);
// }

module.exports = {
    getGoodsList,
    getDetail,
    getTradeRecord
    // getComment,
    // splitComment,
    // getCommentScore
};