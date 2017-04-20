let querystring = require('querystring');

let spiderSetting = require('../util/spiderSetting');
let db = require('../db/jd');
let util = require('../util/common');
let jdCookies = require('../util/jdCookies');
let query = require('../../schema/mysql');
let sql = require('../../schema/sql');

let config = {
    method: 'POST',
    host: 'shop.m.jd.com',
    path: '/search/searchWareAjax.json',
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

async function getCommentByPage(shopId, wareId, offset) {
    let Cookie = await jdCookies.getCookies(shopId);
    config = Object.assign(config, {
        host: 'item.m.jd.com',
        path: '/newComments/newCommentsDetail.json',
        headers: {
            Referer: `https://item.m.jd.com/product/${wareId}.html`,
            Cookie,
            scheme: 'https',
            Origin: 'https://item.m.jd.com'
        }
    })

    let postData = querystring.stringify({
        wareId,
        offset,
        num: 10,
        type: 0,
        checkParam: 'LUIPPTP'
    });
    let result = await util.getPostData(config, postData);
    return JSON.parse(result);
}

async function getCommentById(shopId, goods) {
    let startPage = Math.ceil(goods.totalCount / 10);
    let isEnd = false;
    let comments = [];
    // jd评论为升序排列，需从后向前获取
    for (let page = startPage; page && !isEnd; page--) {
        let comment = await getCommentByPage(shopId, goods.wareId, page);
        totalPage = comment.totalPage;
        let data = comment.commentInfoList;
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
        console.log(`jd:第${startPage-page}/${startPage}条商品评论信息读取完毕`);
    }
    return comments;
}

async function getComment(goodsList, shopId = '170564') {

    let comments = [];
    if (typeof goodsList == 'undefined' || goodsList.length == 0) {
        // 此查询中需同时关联查询出最近评论的id
        goodsList = await query(sql.query.jd_goods_havecomment);
    }

    for (let i = 0; i < goodsList.length; i++) {
        let record = await getCommentById(shopId, goodsList[i]);
        await query(sqlParser.handleJDCommentList(record));
        console.log(`jd:第${i+1}/${goodsList.length}条商品评论信息插入完毕`);
    }
    return comments;
}

module.exports = {
    getGoodsList,
    getComment
};