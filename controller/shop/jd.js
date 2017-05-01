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
    return JSON.parse(result);
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
        db.setGoodList(wareInfo);
        console.log(`${util.getNow()}:id:${shopId},第${i}/${totalPage}页商品列表插入完毕`);
    }
}

async function getShopTemplate(shopInfo) {
    let detailUrl = 'https://shop.m.jd.com/detail/detailInfo?shopId=' + shopInfo.id;
    console.log(`正在采集【${shopInfo.name}】店铺信息,url:${detailUrl}`);
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
        let result;
        // 增加timeout 10s，重复5次
        for (let times = 0; times < 5; times++) {
            result = await util.getPostData(config, postData);
            //当无返回，或有返回且返回值不为timeout时终止
            if (!result || result != 'timeout') {
                break;
            }
        }

        if (typeof result === 'string' && result === 'timeout') {
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

        console.log(`jd:第${startPage-page}/${startPage}条商品评论信息读取并插入完毕`);
    }
    return comments;
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
            let html = `${util.getNow()},第${startPage-page+1}/${startPage}页无评论信息,url:https://item.m.jd.com/product/${goods.wareId}.html`;
            await util.mail.send({
                subject: '接口数据读取异常',
                html
            });
            console.log(html);
        }
        // 下次读取至少等待1-2秒
        let sleepTimeLength = (1000 + Math.random() * 3000).toFixed(0);
        console.log(`${util.getNow()},id:${goods.wareId},第${startPage-page+1}/${startPage}条商品评论信息读取并插入完毕,休息${sleepTimeLength}ms 后继续`);
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
        console.log(`\n${shop.name}:${i+1}/${goodsList.length}评论信息获取完毕,${util.getNow()}.`);
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
        let segData = await segOneComment(item);
        // 处理数据/入库
        await handleSegData(segData);

        let nlpData = await nlpOneComment(item);
        if (typeof nlpData.negative != 'undefined') {
            let sqlStr = sqlParser.handleJDCommentNlp(nlpData);
            await query(sqlStr);
        }
        let sleepTimeLength = (1000 + Math.random() * 1000).toFixed(0);
        console.log(`评论分词读取完毕,休息${sleepTimeLength}ms 后继续`);
        await util.sleep(sleepTimeLength);
    }
}

async function segOneComment(item) {
    let results;
    await util.wordSegment(item.commentData).then(res => {
        results = {
            commentId: item.commentId,
            tokens: res.tokens,
            combtokens: res.combtokens
        }
    }).catch(e => {
        console.log(e);
    });
    return results;
}

async function nlpOneComment(item) {
    let results;
    await util.getNegativeWords(item.commentData).then(res => {
        results = {
            commentId: item.commentId,
            negative: res.negative,
            positive: res.positive
        };
    }).catch(e => {
        console.log(e);
    });
    return results;
}

module.exports = {
    getGoodsList,
    getComment,
    getShopTemplate,
    getGoodsListAndSave,
    getCommentFromDb
};