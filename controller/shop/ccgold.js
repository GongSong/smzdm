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
  let str = html.split('spec_param = ')[1].split('var spec')[0].replace(';', '');
  let data = JSON.parse(str);
  return data;
}

async function getGoodsDetailById(settings) {
  let {
    goods,
    page,
    goodsId,
    goodsFlag
  } = settings;

  if (page == goods.length) {
    return [];
  }

  let id;
  if (goodsId == 0) {
    id = goods[page].goodsId;
  } else {
    id = goodsId;
  }

  let config = {
    method: 'get',
    url: 'http://www.ccgold.cn/shop/index.php',
    params: {
      url: 'goods',
      fun: 'index',
      goods_id: id
    }
  }

  console.log('正在抓取第' + page + '页,id=' + id);

  return await axios(config).then(res => {
    let goodItem = parser.ccgold.goodsDetail(res.data, id, goods[page].cate_id);
    let data = getGoodsIdByWeight(res.data);

    goodsFlag[id] = true;

    // 如果  data.length == 1,说明商品无同类产品，不进入该循环而直接跳至下一条信息；
    for (let i = 0; i < data.length; i++) {
      let curId = data[i].goods_id;
      if (typeof goodsFlag[curId] == 'undefined') {
        return getGoodsDetailById({ goods, page, goodsId: curId, goodsFlag }).then(res => [...goodItem, ...res]);
      }
    }
    return getGoodsDetailById({ goods, page: page + 1, goodsFlag, goodsId: 0 }).then(res => [...goodItem, ...res]);

  }).catch(e => console.log(e));
}

// 获取商品列表
async function getGoodsList() {
  // let goods = require('../data/ccgoldgoodsList.json');
  let goods = await getgoodsListByCat();
  return getGoodsDetailById({ goods, page: 0, goodsFlag: [], goodsId: 0 });
}

module.exports = {
  getGoodsList
};