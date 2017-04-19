var axios = require('axios');
var parser = require('../util/htmlParser');
var spiderSetting = require('../util/spiderSetting');
// 获取商品主表信息
async function getgoodsListByCat(page = 1) {
  console.log('正在抓取第' + page + '页');
  let config = {
    method: 'get',
    url: 'http://www.ccgold.cn/shop/index.php',
    params: {
      url: 'search',
      fun: 'list',
      cate_id: page
    }
  }
  return await axios(config).then(res => {
    let goodItem = parser.ccgold.goodsList(res.data, page);
    if (goodItem.length == 0) {
      return [];
    }
    return getgoodsListByCat(page + 1).then(res => [...goodItem, ...res]);
  }).catch(e => console.log(e));
}

function getGoodsIdByWeight(html) {
  let str = html.split('spec_param = ')[1].split(';')[0];
  let data = JSON.parse(str);
  return data;
}

async function getDetail(goodsId, cate_id) {
  let config = {
    method: 'get',
    url: 'http://www.ccgold.cn/shop/index.php',
    params: {
      url: 'goods',
      fun: 'index',
      goods_id: goodsId
    }
  }
  let html = await axios(config).then(res => res.data);
  let data = parser.ccgold.goodsDetail(html, goodsId, cate_id);
  let slibingData = getGoodsIdByWeight(html);
  return {
    data,
    slibingData
  }
}
async function getGoodsDetailByIds(goodsId, cate_id) {
  let goods = await getDetail(goodsId, cate_id);
  let data = goods.slibingData;
  let goodItem = goods.data;

  for (let i = 0; i < data.length; i++) {
    let curId = data[i].goods_id;
    if (curId != goodsId) {
      result = await getDetail(curId, cate_id);
      goodItem = [...goodItem,...result.data];
    }
  }
  return goodItem;
}
// 获取商品列表
async function getGoodsList() {
  // let goods = require('../data/ccgoldgoodsList.json');
  let goods = await getgoodsListByCat();
  let goodList = [];
  for (let i = 0; i < goods.length; i++) {
    let item = goods[i];
    console.log(`正在抓取第${i}/${goods.length}页，id:${item.goodsId}`);
    let record = await getGoodsDetailByIds(item.goodsId, item.cate_id);
    goodList = [...goodList, ...record];
  }
  return goodList;
}

module.exports = {
  getGoodsList
};