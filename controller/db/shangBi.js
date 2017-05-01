let query = require('../../schema/mysql');
let sqlParser = require('../util/sqlParser');
let sql = require('../../schema/sql');

async function setGoodsData(data) {
    let sqlStr = sqlParser.handleShCoinGoods(data);
    await query(sqlStr);
}

async function getGoodsList() {
    let sqlStr = sql.query.sb_ireal_goods;
    return await query(sqlStr);
}

async function setSaleDetail(arr) {
    if (typeof arr == 'undefined') {
        arr = require('../data/goodsItemSaleDetail.json');
    }
    if (arr.length == 0) {
        return;
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
    setGoodsData
}