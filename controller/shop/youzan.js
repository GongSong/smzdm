let axios = require('axios');
let parser = require('../util/htmlParser');
let spiderSetting = require('../util/spiderSetting');
let db = require('../db/youzan');

// 获取商品主表信息
async function getGoodsById(alias = '8vcj4vsg', page = 1) {
  console.log('正在抓取第' + page + '页');
  let config = {
    method: 'get',
    url: 'https://h5.youzan.com/v2/showcase/tag',
    params: {
      alias,
      page
    }
  }
  return await axios(config).then(res => {
    let goodItem = parser.youzan.goodsList(res.data);
    if (goodItem.length == 0) {
      return [];
    }
    return getGoodsById(alias, page + 1).then(res => [...goodItem, ...res]);
  }).catch(e => console.log(e));
}

// 获取商品列表
function getGoodsList(req, res) {
  // 8vcj4vsg
  let shopid = req.params.id;
  getGoodsById(shopid).then(response => {
    res.json(response);
  });
}

//获取单件商品总库存及总销量
async function getSaleDetail(item) {
  let config = {
    method: 'get',
    url: 'https://h5.youzan.com/v2/goods/' + item.alias,
    headers: spiderSetting.headers.youzan
  };

  return await axios(config).then(res => {
    let data = parser.youzan.goodsDetail(res.data);
    data = Object.assign(data, item);
    return data;
  });
}

// 获取销售详情
async function getSaleInfo(goods) {
  if (typeof goods == 'undefined') {
    goods = require('../data/goodsList.json');
  }
  let data = [],
    length = goods.length;

  for (let i = 0; i < length; i++) {
    console.log(`正在 获取 youzan商品销售详情(${i+1}/${length})`);
    let item = goods[i];
    let record = getSaleDetail({
      alias: item.alias,
      goodId: item.goodId
    });
    data.push(record);
  }
  return data;
}

// 销售数据增量备份
async function getSaleDetail(goodItem, page = 1) {
    let isEnd = false;
    let records = [];
    for (let i = 1; !isEnd; i++) {
        // 获取单页数据
        let data = await getSaleDetailByPage(goodItem, i);
        let length = data.length;
        if(length == 0){
            isEnd = true;
        }
        // 数据过滤（默认id从大到小排列，前序获取数据后表示后序数据已经入库）
        data = data.filter(item => item.last_date >  goodItem.recDate);
        // 如果有数据被过滤掉
        if (data.length < length) {
            isEnd = true;
        }
        records = [...records, ...data];
    }
    return records;
}

async function getSaleDetailByPage(goodItem, page = 1) {
  let config = {
    method: 'get',
    url: 'https://h5.youzan.com/v2/trade/order/orderitemlist.json',
    params: {
      alias: goodItem.alias,
      page
    },
    headers: spiderSetting.headers.youzan
  }
  return await axios(config).then(res => res.data.data.list).catch(e => console.log(e));
}

async function handleSaleDetail(item) {
  let res = await getSaleDetail(item);
  item.data = res;
  Reflect.deleteProperty(item,'recDate')
  return item;
}

// 获取单件商品销售详情
function getTradRecord(goods) {
  if (typeof goods == 'undefined') {
    goods = require('../data/goodsList.json');
  }
  let data = [],
    length = goods.length;

  // 最近一次更新位置
  let lastData = await db.getLastComment();

  for (let i = 0; i < length; i++) {
    console.log(`正在 获取 youzan商品交易记录(${i+1}/${length})`);
    let curItem = goods[i];

    //获取当前产品最近一次销售记录时间
    let recDate = lastData.filter(item => item.goodId == curItem.goodId);
    recDate = recDate.length ? recDate[0].last_date : 0;

    let record = handleSaleDetail({
      alias: curItem.alias,
      goodId: curItem.goodId,
      recDate
    });
    data.push(record);
  }
  return data;
}

module.exports = {
  getGoodsList,
  getSaleInfo,
  getTradRecord
};