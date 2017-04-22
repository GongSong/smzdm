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
    let result = await util.getPostData(config, postData);
    return JSON.parse(result);
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

        data = data.map(item => {
            item.wareId = goods.wareId;
            return item;
        })

        if (data.length) {
            let url = sqlParser.handleJDCommentList(data);
            console.log(url);
            await query(url);
        } else {
            console.log(`${goods.wareId}无评论信息,url:https://item.m.jd.com/product/${goods.wareId}.html`);
        }
        // 下次读取至少等待1-5秒
        let sleepTimeLength = (1000 + Math.random() * 6000).toFixed(0);
        console.log(`${util.getNow()},id:${goods.wareId},第${startPage-page}/${startPage}条商品评论信息读取并插入完毕,接下来我休息${sleepTimeLength}ms`);
        await util.sleep(sleepTimeLength);
    }
}

async function getComment(goodsList, shopId = '170564') {

    if (typeof goodsList == 'undefined' || goodsList.length == 0) {
        // 此查询中需同时关联查询出最近评论的id
        goodsList = await query(sql.query.jd_goods_havecomment);
    }

    for (let i = 0; i < goodsList.length; i++) {
        // 获取评论内容跟存储评论内容同步完成，对于销量较多的店铺很必要
        await getCommentAndSavedById(shopId, goodsList[i]);
        console.log(`${i}/${goodsList.length}评论信息获取完毕.`);
        // if (record.length) {
        //     await query(sqlParser.handleJDCommentList(record));
        // }
        // console.log(`jd:第${i+1}/${goodsList.length}条商品评论信息插入完毕`);
    }
}

module.exports = {
    getGoodsList,
    getComment,
    getShopTemplate,
    getGoodsListAndSave
};