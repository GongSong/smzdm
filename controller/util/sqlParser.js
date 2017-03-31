let sql = require('../../schema/sql.js')

// 本模块用于一次性插入大量数据时对原始数据的处理

function handleGoodsData (obj) {
  let url = sql.insert.yz_goods

  let sqlValues = obj.data.map(item => {
    return `('${item.alias}',${item.goodId},'${item.title}',${item.price},${item.priceTaobao},'${item.imgSrc}','${item.isVirtual}','${obj.shopName}')`
  })
  url = url.replace('?', sqlValues.join(','))
  return url
}

function handleStockData (obj) {
  let url = sql.insert.yz_stock
  let rec_date = getNow()
  let sqlValues = obj.data.map(item => {
    return `('${item.alias}',${item.goodId},${item.sales},${item.stock},'${item.freight}','${rec_date}','${obj.shopName}')`
  })
  url = url.replace('?', sqlValues.join(','))
  return url
}

// 销售记录详情数据
function handleSaleDetailData (saleInfo) {
  let url = sql.insert.yz_trade_record
  let lastTimeStr = '';
  let sqlValues = saleInfo.data.map(item => {
    
    // 处理原始销售记录中未输出年份的问题
    let time = item.update_time
    time = ((time.substr(0, 2) > '03') ? '2016-' : '2017-') + time

    // 默认大于3月为2016年，否则为2017年，数据列表中有2-29这样的非法日期，事实上应为2016或2015年的销售记录
    if(lastTimeStr !== ''){
      if(time>lastTimeStr){
        time = lastTimeStr;
      }
    }
    lastTimeStr = time;

    return `('${saleInfo.alias}',${saleInfo.goodId},'${item.nickname}',${item.item_num},${item.item_price},'${time}','${saleInfo.shopName}')`
  })
  url = url.replace('?', sqlValues.join(','))
  return url
}

module.exports = {
  handleSaleDetailData,
  handleStockData,
handleGoodsData}
