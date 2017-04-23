let querystring = require('querystring');
let axios = require('axios');
let spiderSetting = require('../util/spiderSetting');
let db = require('../db/tmall');
let util = require('../util/common');
let query = require('../../schema/mysql');
let sql = require('../../schema/sql');
let sqlParser = require('../util/sqlParser');
let parser = require('../util/htmlParser');

let config = {
    method: 'GET',
};

let headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, sdch, br',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
};

async function getGoodsListAndSave(shopInfo) {
    let totalPage = 1;
    // 商品详情页：https://detail.m.tmall.com/item.htm?id=39792032232
    // let configObj = {
    //     host: shopInfo.url.replace(/https:\/\//, ''),
    //     path: '/shop/shop_auction_search.do'
    // };
    // let configHeaders = {
    //     Host: configObj.host,
    //     Origin: shopInfo.url,
    //     Refer: shopInfo.url + '/?spm=a222m.7628550/A.0.0
    // }
    // config.headers = Object.assign(config.headers, configHeaders);
    // config = Object.assign(config, configObj);

    let url = shopInfo.url + '/shop/shop_auction_search.do?sort=s&p='
    for (let i = 1; i <= totalPage; i++) {

        // let postData = querystring.stringify({
        //     sort: 's',
        //     p: i
        // });
        // let record = await util.getPostData(config, postData);

        // console.log(config.headers.Cookie);
        // headers.Host = shopInfo.url.replace(/https:\/\//, '');
        headers.Referer = shopInfo.url + '/shop/shop_auction_search.htm?spm=a320p.7692171.0.0&suid=1720024852&sort=default';

        let record = await axios({
            method: 'get',
            url,
            params: {
                spm: 'a320p.7692171.0.0',
                suid: shopInfo.uid,
                sort: 's',
                p: i,
                page_size: 12,
                from: 'h5',
                shop_id: shopInfo.id,
                ajson: 1,
                _tm_source: 'tmallsearch'
            },
            headers
        }).then(res => res.data);
        // let record = await axios.get(url + i).then(res => res.data);
        totalPage = record.total_page;
        await db.setGoodList(record);

        // 10-30秒后进行下一次获取
        let sleepTimeLength = (10000 + Math.random() * 30000).toFixed(0);
        console.log(`${util.getNow()}:${shopInfo.name},第${i}/${totalPage}页商品列表插入完毕,休息${sleepTimeLength}ms 后继续`);
    }
}

async function getShopTemplate(shopInfo) {
    let detailUrl = shopInfo.url + '/shop/shop_info.htm';
    console.log(`正在采集【${shopInfo.name}】店铺信息,url:${detailUrl}`);
    let shopDetail = await axios.get(detailUrl).then(res => res.data.split('shopData =')[1].split('}}};')[0] + '}}}').catch(e => { console.log(e) });
    let detail = JSON.parse(shopDetail);
    detail = detail.shopDetail;
    // 商品分类信息受店铺修改化设置影响较大，此处不做处理
    return {
        shopId: detail.id,
        uid: detail.sellerId,
        title: detail.title,
        nick: detail.nick,
        url: 'https://' + detail.shopUrl,
        goodsScore: detail.shopDSRScore.merchandisScore,
        serviceScore: detail.shopDSRScore.serviceScore,
        expressScore: detail.shopDSRScore.consignmentScore,
        sellerGoodPercent: detail.shopDSRScore.sellerGoodPercent.replace('%', ''),
        rankType: detail.rankType,
        prov: detail.prov,
        city: detail.city,
        collectNum: detail.collectNum,
        logoUrl: detail.fuzzyUrl,
        isBrandShop: detail.isBrandShop || 0,
        shopAge: detail.shopAge,
        shopTypeLogo: detail.shopTypeLogo || '',
        wwUrl: detail.wwUrl,
        rankNum: detail.rankNum,
        collectorCount: detail.collectorCount,
    };
}

// async function getCommentByPage(Cookie, shopId, wareId, offset) {
//     // let Cookie = await jdCookies.getCookies(shopId);
//     config = Object.assign(config, {
//         host: 'item.m.jd.com',
//         path: '/newComments/newCommentsDetail.json',
//         headers: {
//             Referer: `https://item.m.jd.com/product/${wareId}.html`,
//             Cookie,
//             scheme: 'https',
//             Origin: 'https://item.m.jd.com',
//             'content-type': 'application/x-www-form-urlencoded',
//             'accept-language': 'zh-CN,zh;q=0.8',
//         }
//     })

//     let postData = querystring.stringify({
//         wareId,
//         offset,
//         num: 10,
//         type: 0,
//         checkParam: 'LUIPPTP'
//     });
//     let result = await util.getPostData(config, postData);
//     return JSON.parse(result);
// }

// async function getCommentById(shopId, goods) {
//     let Cookie = await jdCookies.getCookiesFromUrl(shopId);
//     let startPage = Math.ceil(goods.totalCount / 10);
//     let isEnd = false;
//     let comments = [];
//     // jd评论为升序排列，需从后向前获取
//     for (let page = startPage; page > 0 && !isEnd; page--) {
//         let comment = await getCommentByPage(Cookie, shopId, goods.wareId, page);
//         let data = comment.wareDetailComment.commentInfoList;
//         let lengthBeforeFilter = data.length;
//         // if (typeof goods.lastId == 'undefined') {
//         //     goods.lastId = 0;
//         // }
//         data = data.filter(item => item.commentId > goods.lastId);

//         // 如果有数据被过滤，停止抓取
//         if (data.length < lengthBeforeFilter) {
//             isEnd = true;
//         }
//         comments = [...comments, ...data];
//         comments = comments.map(item => {
//             item.wareId = goods.wareId;
//             return item;
//         })
//         console.log(`jd:第${startPage-page}/${startPage}条商品评论信息读取并插入完毕`);
//     }
//     return comments;
// }

// async function getCommentAndSavedById(shopId, goods) {
//     let Cookie = await jdCookies.getCookiesFromUrl(shopId);
//     let startPage = Math.ceil(goods.totalCount / 10);
//     let isEnd = false;
//     // jd评论为升序排列，需从后向前获取
//     for (let page = startPage; page > 0 && !isEnd; page--) {
//         let comment = await getCommentByPage(Cookie, shopId, goods.wareId, page);
//         let data = comment.wareDetailComment.commentInfoList;
//         let lengthBeforeFilter = data.length;
//         // if (typeof goods.lastId == 'undefined') {
//         //     goods.lastId = 0;
//         // }
//         data = data.filter(item => item.commentId > goods.lastId);

//         // 如果有数据被过滤，停止抓取
//         if (data.length < lengthBeforeFilter) {
//             isEnd = true;
//         }

//         data = data.map(item => {
//             item.wareId = goods.wareId;
//             return item;
//         })

//         if (data.length) {
//             let url = sqlParser.handleJDCommentList(data);
//             console.log(url);
//             await query(url);
//         } else {
//             await util.mail.send({
//                 subject: '接口数据读取异常',
//                 html: `${util.getNow()},${goods.wareId}无评论信息,url:https://item.m.jd.com/product/${goods.wareId}.html`
//             });
//             console.log(`${util.getNow()},${goods.wareId}无评论信息,url:https://item.m.jd.com/product/${goods.wareId}.html`);
//         }
//         // 下次读取至少等待1-2秒
//         let sleepTimeLength = (1000 + Math.random() * 1000).toFixed(0);
//         console.log(`${util.getNow()},id:${goods.wareId},第${startPage-page}/${startPage}条商品评论信息读取并插入完毕,休息${sleepTimeLength}ms 后继续`);
//         await util.sleep(sleepTimeLength);
//     }
// }

// async function getComment(shop) {
//     goodsList = await query(sql.query.jd_goods_havecomment + ' and a.shopId = ' + shop.id);
//     if (goodsList.length > 1) {
//         await util.mail.send({
//             subject: '采集JD用户评论数据',
//             html: `正在获取${shop.name}( https://shop.m.jd.com/?shopId=${shop.id} )的评论数据,共${goodsList.length}件商品,@ ${util.getNow()}`
//         });
//     }
//     for (let i = 0; i < goodsList.length; i++) {
//         // 获取评论内容跟存储评论内容同步完成，对于销量较多的店铺很必要
//         await getCommentAndSavedById(shop.id, goodsList[i]);
//         console.log(`${shop.name}:${i}/${goodsList.length}评论信息获取完毕,${util.getNow()}.`);
//     }
// }

module.exports = {
    getShopTemplate,
    getGoodsListAndSave,
    // getGoodsList,
    // getComment,
};