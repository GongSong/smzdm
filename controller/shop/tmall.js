let querystring = require('querystring');
let axios = require('axios');
let spiderSetting = require('../util/spiderSetting');
let db = require('../db/tmall');
let util = require('../util/common');
let query = require('../../schema/mysql');
let sql = require('../../schema/sql');
let sqlParser = require('../util/sqlParser');
let parser = require('../util/htmlParser');
let fs = require('fs');

let config = {
    method: 'GET',
};

let headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, sdch, br',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'Connection': 'keep-alive',
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

        headers.Host = shopInfo.url.replace(/https:\/\//, '');
        headers.Referer = shopInfo.url + '/shop/shop_auction_search.htm?spm=a320p.7692171.0.0&suid=' + shopInfo.uid + '&sort=default';
        headers.Cookie = '_m_h5_tk=98205868167370ef8e64ae64d7c3bf72_1493035389683; _m_h5_tk_enc=f405cb7026eb2fadffbfe1157d137218; cna=pwN0EBNOLAYCAd7UF9NP4NhG; isg=AnZ2ndVNMjziiMnIBViCALVqx6wBf7rRwbF0sOBfYtn0Ixa9SCcK4dzRSUWw; l=AkZGL3waXEyuwaPf-lq6pKpgFifIp4ph';

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

async function getGoodsFromJsonAndSave(shopInfo) {
    let totalPage = 1;
    let startIdx = 1;
    if (shopInfo.id == '110384005') {
        // 菜百已经存储8页数据
        startIdx = 9;
    }

    for (let i = startIdx; i <= totalPage; i++) {
        let curPage = ('0' + i).substr(('0' + i).length - 2, 2);
        let fileName = `${util.getMainContent()}/controller/data/tmall/tmallData/${shopInfo.id}/${curPage}.json`;
        let record;
        try {
            let str = fs.readFileSync(fileName, 'utf-8');
            record = JSON.parse(str);
        } catch (e) {
            console.info('第' + i + '条信息读取失败');
            continue;
        }
        totalPage = record.total_page;
        await db.setGoodList(record);
        console.log(`${util.getNow()}:${shopInfo.name},第${i}/${totalPage}页商品列表插入完毕`);
    }
}

module.exports = {
    getShopTemplate,
    getGoodsListAndSave,
    getGoodsFromJsonAndSave,
    // getGoodsList,
    // getComment,
};