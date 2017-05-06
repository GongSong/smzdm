let axios = require('axios');
let parser = require('../util/htmlParser');
let sql = require('../util/sqlParser');
let db = require('../db/shangBi');
let cheerio = require('cheerio');
let util = require('../util/common');
let querystring = require('querystring');

let MAX_NUM = 20;
// 获取商品主表信息
async function getGoodsByPage(page = 1) {
    console.log('正在抓取第' + page + '页');
    let config = {
        method: 'post',
        url: 'http://shangbi.irealweixin.com/index.php/Product/GetProMore.html',
        data: querystring.stringify({
            action: 'GetProMore',
            p: page,
            PageSize: MAX_NUM
        })
    }
    return await axios(config).then(res => handleGoodsDetail(res.data)).catch(e => console.log(e));
}

function handleGoodsDetail(html) {
    let $ = cheerio.load(html);
    let nodes = $('li');
    let goodsList = [];
    let rec_date = util.getNow();
    nodes.each((i, item) => {
        let dom = $(item);
        let price = dom.find('h6 strong').text().split('￥')[1].replace(',', '');
        let detail = dom.find('.car_ico').eq(0).attr('onclick').replace(/getDetails\(/, '').replace(/\)/, '').replace(/'/g, '').replace(/"/g, '').split(',');
        if (detail.length < 4) {
            console.log('ShangBi数据接口异常,id:');
            console.log(dom.html());
            return;
        }
        goodsList.push({
            price,
            item_id: detail[0],
            title: detail[1],
            imgSrc: detail[2],
            storage: detail[3],
            rec_date
        })
    });
    return goodsList;
}

async function getGoodsList() {
    let page = 1,
        isEnd = false;
    let goodsList = [];
    for (let i = page; !isEnd; i++) {
        let data = await getGoodsByPage(i);
        if (data.length < MAX_NUM) {
            isEnd = true;
        }
        goodsList = [...goodsList, ...data];
    }
    goodsList.push({
        price: 298,
        item_id: 123,
        title: '称心如意手把件-紫铜',
        imgSrc: '/Uploads/20160923/57e4cb499937b.png',
        storage: '0',
        rec_date: util.getNow()
    });
    return goodsList;
}

// 获取销售详情
async function getSaleInfo(goods) {
    if (typeof goods == 'undefined') {
        goods = await db.getGoodsList();
    }
    let data = [],
        length = goods.length;

    for (let i = 0; i < length; i++) {
        console.log(`正在 获取上币商品销售详情(${i+1}/${length})`);
        let item = goods[i];
        let record = await getSaleDetail(item.item_id);
        record.shift(1);
        record = record.filter(newItem => newItem.order_time > item.order_time);
        data = [...data, ...record];
    }
    return data;
}

// 销售数据增量备份
async function getSaleDetail(goodId) {
    let html = await axios.get(`http://shangbi.irealweixin.com/index.php/Product/details/id/${goodId}.html`).then(res => res.data).catch(e => console.log(e));
    let data = parser.shangBi.tradeRecord(html, goodId);
    console.log(data);
    return data;
}

module.exports = {
    getGoodsList,
    getSaleInfo
};