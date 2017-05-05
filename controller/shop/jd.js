let querystring = require('querystring');
let axios = require('axios');
let spiderSetting = require('../util/spiderSetting');
let db = require('../db/jd');
let util = require('../util/common');
let jdCookies = require('../util/jdCookies');
let query = require('../../schema/mysql');
let sql = require('../../schema/sql');
let sqlParser = require('../util/sqlParser');
let parser = require('../util/htmlParser');
let fs = require('fs');

let config = {
    method: 'POST',
    host: 'shop.m.jd.com',
    path: '/search/searchWareAjax.json',
    timeout: 10000,
    headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Host': 'shop.m.jd.com',
        'Origin': 'https://shop.m.jd.com',
        'Referer': 'https://shop.m.jd.com/search/search?shopId=',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'X-Requested-With': 'XMLHttpRequest'
    }
};

async function getListByPage(searchPage = 1, shopId = '170564') {
    config.headers.Referer = config.headers.Referer + shopId;
    let postData = querystring.stringify({
        shopId,
        searchPage,
        searchSort: 1
    });
    let result = await util.getPostData(config, postData);
    try {
        return JSON.parse(result);
    } catch (e) {
        console.log(e);
        return {
            "results": {
                "totalCount": 0,
                "totalPage": 0,
                "pageIdx": 1,
                "pageSize": 20,
                "hasNext": false,
                "wareInfo": [],
                "topWare": []
            },
            "success": false
        }
    }
}

// 获取商品列表
async function getGoodsList(shopId = '170564') {
    let goodsList = [];
    let totalPage = 1;

    config.headers.Cookie = await jdCookies.getCookies(shopId);

    for (let i = 1; i <= totalPage; i++) {
        // console.log(config.headers.Cookie);
        let record = await getListByPage(i, shopId);
        let item = record.results;
        totalPage = item.totalPage;
        // 2017-04-20
        // 此处可考虑将商品名称中属性信息分离存储
        let wareInfo = item.wareInfo.map(item => {
            item.shopId = shopId;
            return item;
        })
        goodsList = [...goodsList, ...wareInfo];
    }
    return goodsList;
}

async function getGoodsListAndSave(shopId = '170564') {
    let totalPage = 1;

    config.headers.Cookie = await jdCookies.getCookies(shopId);
    let startPage = 1;
    // if(shopId ==206137){
    //   startPage=376;
    //   totalPage=376;
    // }
    for (let i = startPage; i <= totalPage; i++) {
        // console.log(config.headers.Cookie);
        let hasErr = false;
        let sleepTimeLength = (Math.random() * 1500).toFixed(0);
        let record = await getListByPage(i, shopId).catch(e => {
            console.log(e);
            hasErr = true;
        })
        if (hasErr || !record.success) {
            await util.sleep(sleepTimeLength);
            continue;
        }
        let item = record.results;
        if (typeof item.wareInfo == 'undefined' || typeof item.totalPage == 'undefined') {
            continue;
        }
        totalPage = item.totalPage;
        // 2017-04-20
        // 此处可考虑将商品名称中属性信息分离存储
        let wareInfo = item.wareInfo.map(item => {
            item.shopId = shopId;
            return item;
        })
        if (wareInfo.length) {
            db.setGoodList(wareInfo);
        }
        await util.sleep(sleepTimeLength);
        console.log(`${util.getNow()}:id:${shopId},第${i}/${totalPage}页商品列表插入完毕,休息${sleepTimeLength}ms 后继续`);
    }
}

async function getShopTemplate(shopInfo) {
    let detailUrl = 'https://shop.m.jd.com/detail/detailInfo?shopId=' + shopInfo.id;
    console.log(`正在采集【${shopInfo.id}】店铺信息,url:${detailUrl}`);
    let mainInfo = await axios.get('https://shop.m.jd.com/index/getShopTemplate.json?shopId=' + shopInfo.id).then(res => res.data.shopInfo);
    // let detailUrl = await axios.get('https://shop.m.jd.com/?shopId=' + shopId).then(res => parser.jd.getDetailUrl(res.data));
    let extraInfo = await axios.get(detailUrl).then(res => parser.jd.getShopDetail(res.data, detailUrl));
    return Object.assign(mainInfo, extraInfo);
}

async function getCommentByPage(Cookie, shopId, wareId, offset) {
    // let Cookie = await jdCookies.getCookies(shopId);
    config = Object.assign(config, {
        host: 'item.m.jd.com',
        path: '/newComments/newCommentsDetail.json',
        headers: {
            Referer: `https://item.m.jd.com/product/${wareId}.html`,
            Cookie,
            scheme: 'https',
            Origin: 'https://item.m.jd.com',
            'content-type': 'application/x-www-form-urlencoded',
            'accept-language': 'zh-CN,zh;q=0.8',
        }
    })

    let postData = querystring.stringify({
        wareId,
        offset,
        num: 10,
        type: 0,
        checkParam: 'LUIPPTP'
    });
    try {
        let result = 'timeout';
        // 增加timeout 10s，重复5次

        for (let times = 0; result === 'timeout' && times < 5; times++) {
            result = await util.getPostData(config, postData);
        }

        if (result === 'timeout') {
            console.error('超时错误:' + config.host + config.path);
            return {
                wareDetailComment: {
                    commentInfoList: []
                }
            }
        }

        result = JSON.parse(result);
        return result;
    } catch (e) {
        let html = `${util.getNow()}, 服务端无数据返回,url: https://item.m.jd.com/product/${wareId}.html`;
        console.error(html);
        await util.mail.send({
            subject: '接口数据读取异常',
            html
        });
        return {
            wareDetailComment: {
                commentInfoList: []
            }
        }
    }
}

async function getCommentById(shopId, goods) {
    let Cookie = await jdCookies.getCookiesFromUrl(shopId);
    let startPage = Math.ceil(goods.totalCount / 10);
    let isEnd = false;
    let comments = [];
    // jd评论为升序排列，需从后向前获取
    for (let page = startPage; page > 0 && !isEnd; page--) {
        let comment = await getCommentByPage(Cookie, shopId, goods.wareId, page);
        let data = comment.wareDetailComment.commentInfoList;
        let lengthBeforeFilter = data.length;
        // if (typeof goods.lastId == 'undefined') {
        //     goods.lastId = 0;
        // }

        data = data.filter(item => item.commentId > goods.lastId);
        // 如果有数据被过滤，停止抓取
        if (data.length < lengthBeforeFilter) {
            isEnd = true;
        }

        comments = [...comments, ...data];
        comments = comments.map(item => {
            item.wareId = goods.wareId;
            return item;
        })

        console.log(`jd:第${startPage - page}/${startPage}条商品评论信息读取并插入完毕`);
    }
    return comments;
}

async function updateCommentOffset(goodId, offset) {
    let sqlStr = sql.update.jd_comment_updateOffset.replace(/\?1/, offset).replace(/\?2/, goodId);
    await query(sqlStr);
}

/**
 * @return 寻找断点，返回的是断点页序号。
 * @param {*} Cookie 
 * @param {*} shopId 
 * @param {*} goods 
 * @param {*} startPage 起始页
 */
async function testFirstPageOffset(Cookie, shopId, goods, startPage = 0) {
    let sqlStr = sql.query.jd_comment_count.replace(/?/g, goodId);
    let commentProgress = await query(sqlStr);
    if (startPage === 0) {
        startPage = Math.ceil(commentProgress.totalCount / 10);
    }
    // 评论实际数量 = totalCount页数 - 偏移量（页）
    // 在查找断点之前，先判断之前是否记录了实际评论数量和totalCount之间的偏移，如果有则略过后面的测试偏移量，直接返回实际数量与完工数量的差。
    if (commentProgress.cmt_quantity_offset &&
        commentProgress.cmt_quantity_offset > 0 &&
        (commentProgress.totalCount - commentProgress.cmt_quantity_offset - commentProgress.cnt) > 0) {
        return startPage - commentProgress.cmt_quantity_offset - Math.ceil(commentProgress.cnt / 10);
    }
    if ((commentProgress.totalCount - commentProgress.cmt_quantity_offset - Math.ceil(commentProgress.cnt / 10)) <= 0) {
        return 0;
    }
    // 开始测试实际评论数量与totalCount之间的偏移
    // 测试得到偏移量后需要更新商品清单中的偏移量数值
    // 先以2的幂加速下探
    let _page = startPage;
    let _step = 0;
    let _idx = 1;
    do {
        if (_idx > 1) {
            _step = Math.pow(2, _idx - 2);
        }
        _page -= _step;
        let comment = await getCommentByPage(Cookie, shopId, goods.wareId, _page);
        // let comment = blackBox(_page);
        if (comment.wareDetailComment && comment.wareDetailComment.commentInfoList.length > 0) {
            if (comment.wareDetailComment.commentInfoList.length < 10) {
                updateCommentOffset(goodId, (startPage - _page));
                return startPage - _page;
            }
            break;
        }
    } while (startPage >= _page);

    // 再以每次速度减半向目标靠近，当速度降至每页评论数量（10）之内时停止
    _idx = 1;
    let direction = 1;
    do {
        if (_step < 10) {
            break;
        }
        _step = Math.abs(_step) * direction / 2;
        _page += _step;
        let comment = await getCommentByPage(Cookie, shopId, goods.wareId, _page);
        // let comment = blackBox(_page);
        if (comment.wareDetailComment && comment.wareDetailComment.commentInfoList.length < 10) {
            updateCommentOffset(goodId, (startPage - _page));
            return startPage - _page;
        }
        if ((comment === undefined || comment === null) && Math.abs(_step) === 1) {
            _page -= 1;
            break;
        }
        direction = (comment === undefined || comment === null) ? -1 : 1;
    } while (Math.abs(_step) >= 1);
    updateCommentOffset(goodId, (startPage - _page));
    return startPage - _page;
}

function blackBox(page) {
    if (page === 945) {
        return 9;
    }
    if (page < 945) {
        return 10;
    }
    if (page > 945) {
        return null;
    }
}

async function getCommentAndSavedById(shopId, goods) {
    let Cookie = await jdCookies.getCookiesFromUrl(shopId);
    let startPage = Math.ceil(goods.totalCount / 10);
    let isEnd = false;
    // jd评论为升序排列，需从后向前获取
    for (let page = startPage; page > 0 && !isEnd; page--) {
        // 2000条更新一次信息
        if (page % 2000 == 0) {
            Cookie = await jdCookies.getCookiesFromUrl(shopId);
        }

        let comment = await getCommentByPage(Cookie, shopId, goods.wareId, page);
        if (comment.wareDetailComment == null) {
            isEnd = true;
            continue;
        }
        let data = comment.wareDetailComment.commentInfoList;
        let lengthBeforeFilter = data.length;
        // if (typeof goods.lastId == 'undefined') {
        //     goods.lastId = 0;
        // }
        data = data.filter(item => item.commentId > goods.lastId);

        // 如果有数据被过滤，停止抓取
        if (data.length < lengthBeforeFilter) {
            isEnd = true;
        }

        data = data.map(item => {
            item.wareId = goods.wareId;
            return item;
        })

        if (data.length) {
            if (startPage - page < 4) {
                // 如果本页数据和数据库中条数相同，不插入数据。为提高效率，仅针对前5页采用本逻辑
                let commentList = data.map(item => item.commentId);
                let sqlStr = sql.query.jd_comment_distinct + `(${commentList.join(',')})`;
                let dbCommentList = await query(sqlStr);
                console.log(sqlStr);

                // 如果数据库中有信息，不再继续读取后续信息
                if (dbCommentList.length > 0) {
                    console.log('有重复评论信息');
                    isEnd = true;
                    // 更新标志位
                    await query(sql.update.jd_goods_async_status + goods.wareId);
                }

                if (dbCommentList.length != data.length) {
                    let url = sqlParser.handleJDCommentList(data);
                    console.log(url);
                    await query(url);
                }
            } else {
                let url = sqlParser.handleJDCommentList(data);
                console.log(url);
                await query(url);
            }
        } else {
            let html = `${util.getNow()},第${startPage - page + 1}/${startPage}页无评论信息,url:https://item.m.jd.com/product/${goods.wareId}.html`;
            await util.mail.send({
                subject: '接口数据读取异常',
                html
            });
            console.log(html);
        }
        // 下次读取至少等待2.5-3秒
        let sleepTimeLength = (2500 + Math.random() * 500).toFixed(0);
        console.log(`${util.getNow()},id:${goods.wareId},第${startPage - page + 1}/${startPage}条商品评论信息读取并插入完毕,休息${sleepTimeLength}ms 后继续`);
        await util.sleep(sleepTimeLength);
    }
}

async function getComment(shop) {
    // let goodsList = await query(sql.query.jd_goods_havecomment + ' and a.shopId = ' + shop.id);
    let goodsList = await query(sql.query.jd_goods_havecomment); // + ' and a.shopId = ' + shop.id);
    if (goodsList.length > 1) {
        await util.mail.send({
            subject: '采集JD用户评论数据',
            html: `正在获取${shop.name}( https://shop.m.jd.com/?shopId=${shop.id} )的评论数据,共${goodsList.length}件商品,@ ${util.getNow()}`
        });
    }
    for (let i = 0; i < goodsList.length; i++) {
        // 获取评论内容跟存储评论内容同步完成，对于销量较多的店铺很必要
        if (goodsList[i].wareId == '10294082739') {
            continue;
        }
        await getCommentAndSavedById(shop.id, goodsList[i]);
        console.log(`\n${shop.name}:${i + 1}/${goodsList.length}评论信息获取完毕,${util.getNow()}.`);
    }
}

// 分词列表combtokens处理，分词结果入库
async function handleSegData(item) {
    // 处理combtokens信息
    if (typeof item.combtokens == 'undefined') {
        return;
    }
    for (let j = 0; j < item.combtokens.length; j++) {
        let cmb = item.combtokens[j];
        if (typeof cmb == 'undefined' || cmb == null) {
            continue;
        }
        cmb.wtype = cmb.cls;
        item.tokens.push(cmb);
    }
    // 获取单条评论分词结果的sql
    let sqlStr = sqlParser.handleJDCommentSeg(item);
    console.log(sqlStr);
    // 入库 
    if (sqlStr) {
        await query(sqlStr);
    }
}

/**
 * 1.从数据库中获取评论信息，按每页100条依次取数据
 * 2.数据读取完毕后调用NLP处理信息并存储至数据库。
 * 3.获取评论信息的逻辑中需增加条件保证已经处理过的数据不重复处理(待第一页数据添加后测试修改)
 */
async function getCommentFromDb() {
    let isEnd = 0;
    let perNum = 100;
    for (let i = 0; !isEnd; i++) {
        let sqlStr = sqlParser.handleJDCommentFromDb(i, perNum);
        let commentList = await query(sqlStr);
        isEnd = commentList.length < perNum;
        await splitComment(commentList);
    }
}

async function splitComment(commentList) {
    let maxNum = commentList.length;
    for (let i = 0; i < maxNum; i++) {
        let item = commentList[i];
        item.commentData = item.commentData.replace(/&+|#|\$|\\|\r|\n|'/g, '');
        let hasErr = false;
        let segData = await segOneComment(item).catch(e => {
            console.log(e);
            hasErr = true;
        })
        if (hasErr || typeof segData == 'undefined') {
            continue;
        }
        // 处理数据/入库
        await handleSegData(segData);
        let nlpData = await nlpOneComment(item).catch(e => {
            console.log(e);
            hasErr = true;
        })
        if (hasErr || typeof nlpData == 'undefined') {
            continue;
        }
        if (typeof nlpData.negative != 'undefined') {
            let sqlStr = sqlParser.handleJDCommentNlp(nlpData);
            await query(sqlStr);
        }
        // 有人值守，无需等待
        // let sleepTimeLength = (1000 + Math.random() * 1000).toFixed(0);
        // console.log(`评论分词读取完毕,休息${sleepTimeLength}ms 后继续`);
        // await util.sleep(sleepTimeLength);
    }
}

async function segOneComment(item) {
    let results;
    let bingo = false;
    for (let times = 0; !bingo && times < 5; times++) {
        bingo = await util.wordSegment(item.commentData).then(res => {
            results = {
                commentId: item.commentId,
                tokens: res.tokens,
                combtokens: res.combtokens
            };
            return true;
        }, rej => {
            return false;
        }).catch(e => {
            console.log(e);
        });
    }

    if (!bingo) {
        console.error('timeout of comment seg:' + item.commentId + '/' + item.commentData);
    }
    return results;
}

async function nlpOneComment(item) {
    let results;
    let bingo = false;
    for (let times = 0; !bingo && times < 5; times++) {
        bingo = await util.getNegativeWords(item.commentData).then(res => {
            results = {
                commentId: item.commentId,
                negative: res.negative,
                positive: res.positive
            };
            return true;
        }, rej => {
            return false;
        }).catch(e => {
            console.log(e);
        });
    }
    if (!bingo) {
        console.error('timeout of comment nlp:' + item.commentId + '/' + item.commentData);
    }
    return results;
}

async function getShopList(shops, id) {
    let maxNum = shops.length;
    let shopList = [];
    for (let i = 0; i < maxNum; i++) {
        let url = shops[i].url;
        let html = await axios.get(url).then(res => res.data);
        let shopFromPage = parser.jd.getShopList(html);
        shopList = [...shopList, ...shopFromPage];
        console.log(shopFromPage);
        console.log(`${i + 1}/${maxNum}家商铺信息读取完毕`);
    }
    let fileName = `${util.getMainContent()}/controller/data/jd_shopList_${id}.json`;
    fs.writeFileSync(fileName, JSON.stringify(shopList), 'utf8');
    return shopList;
}

module.exports = {
    getGoodsList,
    getComment,
    getShopTemplate,
    getGoodsListAndSave,
    getCommentFromDb,
    getShopList,
    testFirstPageOffset
};