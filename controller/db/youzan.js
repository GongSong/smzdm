let query = require('../../schema/mysql');
let sqlParser = require('../util/sqlParser');
let sql = require('../../schema/sql');

// 最近评论记录
async function getLastTrade() {
    let sqlStr = sql.query.youzan_trad_maxid;
    return await query(sqlStr);
}

function getGoodsData(req, res) {
    query('select * from yz_goods', function(result) {
        let string = JSON.stringify(result)
        res.send(string)
    })
}

async function setGoodsData(arr) {
    if (typeof arr == 'undefined') {
        arr = require('../data/goodsList.json');
    }
    let spiderData = {
        data: arr,
        shopName: '上海造币旗舰店'
    };
    let sql = sqlParser.handleGoodsData(spiderData);
    await query(sql);
}

async function setStockData(arr) {
    if (typeof arr == 'undefined') {
        arr = require('../data/saleDetail.json');
    }
    let spiderData = {
        data: arr,
        shopName: '上海造币旗舰店'
    };
    let sql = sqlParser.handleStockData(spiderData);
    await query(sql);
}

async function setSaleDetail(arr) {
    if (typeof arr == 'undefined') {
        arr = require('../data/goodsItemSaleDetail.json');
    }
    let spiderData = {
        data: arr,
        shopName: '上海造币旗舰店'
    }
    for (let i = 0; i < arr.length; i++) {
        console.log(`正在插入第${i}/${arr.length}条数据`);
        let saleInfo = arr[i];
        if (saleInfo.data.length) {
            saleInfo.shopName = spiderData.shopName;
            let sqlStr = sqlParser.handleSaleDetailData(saleInfo);
            await query(sqlStr);
        }
    }
}

module.exports = {
    setSaleDetail,
    setGoodsData,
    setStockData,
    getGoodsData,
    getLastTrade
}