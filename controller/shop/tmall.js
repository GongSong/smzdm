let querystring = require('querystring');
let axios = require('axios');
let spiderSetting = require('../util/spiderSetting');
let db = require('../db/tmall');
let util = require('../util/common');
// let jdCookies = require('../util/jdCookies');
let query = require('../../schema/mysql');
let sql = require('../../schema/sql');
let sqlParser = require('../util/sqlParser');
let parser = require('../util/htmlParser');

// async function getListByPage(searchPage = 1, shopId = '170564') {
//     config.headers.Referer = config.headers.Referer + shopId;
//     let postData = querystring.stringify({
//         shopId,
//         searchPage,
//         searchSort: 1
//     });
//     let result = await util.getPostData(config, postData);
//     return JSON.parse(result);
// }

// // 获取商品列表
// async function getGoodsList(shopId = '170564') {
//     let goodsList = [];
//     let totalPage = 1;

//     config.headers.Cookie = await jdCookies.getCookies(shopId);

//     for (let i = 1; i <= totalPage; i++) {
//         // console.log(config.headers.Cookie);
//         let record = await getListByPage(i, shopId);
//         let item = record.results;
//         totalPage = item.totalPage;
//         // 2017-04-20
//         // 此处可考虑将商品名称中属性信息分离存储
//         let wareInfo = item.wareInfo.map(item => {
//             item.shopId = shopId;
//             return item;
//         })
//         goodsList = [...goodsList, ...wareInfo];
//     }
//     return goodsList;
// }

// async function getGoodsListAndSave(shopId = '170564') {
//     let totalPage = 1;

//     config.headers.Cookie = await jdCookies.getCookies(shopId);

//     for (let i = 1; i <= totalPage; i++) {
//         // console.log(config.headers.Cookie);
//         let record = await getListByPage(i, shopId);
//         let item = record.results;
//         totalPage = item.totalPage;
//         // 2017-04-20
//         // 此处可考虑将商品名称中属性信息分离存储
//         let wareInfo = item.wareInfo.map(item => {
//             item.shopId = shopId;
//             return item;
//         })
//         db.setGoodList(wareInfo);
//         console.log(`${util.getNow()}:id:${shopId},第${i}/${totalPage}页商品列表插入完毕`);
//     }
// }

async function getShopTemplate(shopInfo) {
    let detailUrl = shopInfo.url + '/shop/shop_info.htm';
    console.log(`正在采集【${shopInfo.name}】店铺信息,url:${detailUrl}`);
    let shopDetail = await axios.get(detailUrl).then(res => res.data.split('shopData =')[1].split(';')[0]).catch(e => { console.log(e) });
    let detail = JSON.parse(shopDetail);
    let shopInfo = {
            shopId: detail.id,
            uid: detail.sellerId,
            title: detail.title,
            nick: detail.nick,
            url: 'https://' + detail.shopUrl,
            goodsScore: detail.shopDSRScore.merchandisScore,
            serviceScore: detail.shopDSRScore.serviceScore,
            expressScore: detail.shopDSRScore.consignment,
            sellerGoodPercent: detail.shopDSRScore.sellerGoodPercent.replace('%', ''),
            rankType: detail.rankType,
            prov: detail.prov,
            city: detail.city,
            collectNum: detail.collectNum,
            logoUrl: detail.fuzzyUrl,
            isBrandShop: detail.isBrandShop,
            shopAge: detail.shopAge,
            shopTypeLogo: detail.shopTypeLogo,
            wwUrl: detail.wwUrl,
            rankNum: detail.rankNum,
            collectCount: detail.collectCount,
        }
        // 商品分类信息受店铺修改化设置影响较大，此处不做处理

    return shopInfo;
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
    // getGoodsList,
    // getComment,
    // getGoodsListAndSave
};