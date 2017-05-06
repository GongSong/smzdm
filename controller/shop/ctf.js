let axios = require('axios');
let parser = require('../util/htmlParser');
let sql = require('../util/sqlParser');
let db = require('../db/ctf');
let cheerio = require('cheerio');
let util = require('../util/common');
let querystring = require('querystring');

let MAX_NUM = 10;
// 获取商品主表信息
async function getGoodsByPage(page = 1) {
    console.log('正在抓取第' + page + '页');
    var sql = " [Enabled] = 1 and [IsPointProduct] <> 1 and [IsARProduct] = 0 and [AvailableQty] > 0 AND IsPointProduct not in (9,10,11)";
    let config = {
        method: 'post',
        url: 'https://m.ctfmall.com/ajax.ashx?action=GetGoodsList',
        data: querystring.stringify({
            sqlorder: 'Sales desc',
            sqlwhere: sql,
            pageindex: page,
            pagesize: MAX_NUM,
            singledouble: 0
        })
    }
    return await axios(config).then(res => parser.ctf.goodsList(res.data.state)).catch(e => console.log(e));
}

async function getGoodsList() {
    let page = 1,
        isEnd = false;
    for (let i = page; !isEnd; i++) {
        let data = await getGoodsByPage(i);
        if (data.length < MAX_NUM) {
            isEnd = true;
        }
        db.setGoodsData(data);
    }
}

async function getGoodsDetailByNo(goodsNo) {
    return await axios.get('https://m.ctfmall.com/product/show.aspx?no=' + goodsNo).then(res => res.data);
}

async function getGoodsStorage(goods) {
    let len = goods.length;
    let goodsWeight = [];
    for (let i = 0; i < len; i++) {
        let item = goods[i];
        let config = {
            method: 'post',
            url: 'https://m.ctfmall.com/ajax.ashx?action=Getstockqty',
            data: querystring.stringify({
                Cmd: goods[i].Cmd
            })
        }
        item.inventory = await axios(config).then(res => res.data.qty);
        goodsWeight.push(item);
    }
    return goodsWeight;
}

async function getGoodsDetail() {
    let goodsList = await db.getGoodsList();
    let len = goodsList.length;
    for (let i = 0; i < len; i++) {
        console.log(`正在抓取第${i+1}/${len}页商品属性`);
        let html = await getGoodsDetailByNo(goodsList[i].goods_no);
        let goodsDetail = parser.ctf.goodsDetail(html);
        console.log(goodsDetail);
        let goodsWeight = parser.ctf.goodsWeight(html, goodsList[i].goods_no);
        goodsWeight = await getGoodsStorage(goodsWeight);
        await db.setGoodsDetail(goodsDetail);
        if (goodsWeight.length) {
            await db.setGoodsWeight(goodsWeight);
        }
    }
}

module.exports = {
    getGoodsList,
    getGoodsDetail
};