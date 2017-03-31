let query = require('../schema/mysql.js')
let sqlParser = require('./util/sqlParser')

function getGoodsData(req, res) {
  query('select * from yz_goods', function(result) {
    let string = JSON.stringify(result)
    res.send(string)
  })
}

function setGoodsData(req, res) {
  let arr = require('./data/goodsList.json')
  let spiderData ={
    data:arr,
    shopName:'上海造币旗舰店'
  }
  let sql = sqlParser.handleGoodsData(spiderData)
  query(sql, function(result) {
    let string = JSON.stringify(result)
    res.send(string)
  })
}

function setStockData(req, res) {
  let arr = require('./data/saleDetail.json')
  let spiderData ={
    data:arr,
    shopName:'上海造币旗舰店'
  }
  let sql = sqlParser.handleStockData(spiderData)
  query(sql, function(result) {
    let string = JSON.stringify(result)
    res.send(string)
  })
}

async function insertOneSaleDetailData(sql) {
  return await query(sql, function(result) {
    let string = JSON.stringify(result)
    return string;
  })
}

function setSaleDetail(req, res) {
  let arr = require('./data/goodsItemSaleDetail.json')
  let spiderData ={
    data:arr,
    shopName:'上海造币旗舰店'
  }
  let promises = arr.map((saleInfo, i) => {
    console.log('正在插入第' + i + '条数据')
    if (saleInfo.data.length) {
      saleInfo.shopName = spiderData.shopName;
      let sqlStr = sqlParser.handleSaleDetailData(saleInfo);
      return insertOneSaleDetailData(sqlStr);
    }
  })
  Promise.all(promises).then(item => {
    res.json({
      msg: '所有数据插入完毕'
    })
  })
}

module.exports = {
  setSaleDetail,
  setGoodsData,
  setStockData,
  getGoodsData
}