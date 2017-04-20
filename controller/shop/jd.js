var axios = require('axios');
var parser = require('../util/htmlParser');
var spiderSetting = require('../util/spiderSetting');

let http = require('http');
let util = require('../util/common');
let querystring = require('querystring');

let config = {
  method: 'POST',
  host: 'shop.m.jd.com',
  path: '/search/searchWareAjax.json',
  headers: {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
    'Connection': 'keep-alive',
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': 'abtest=20170419222215359_20; USER_FLAG_CHECK=64831f4e530dff8fdf891989b96aa3bd; m_uuid_new=868DF0A49BAC1C7F7894753281A9D712; __jdv=122270672|www.jd.com|-|tuiguang|-|1492611804118; __jda=122270672.483510958.1484723490.1492611744.1492611804.7; __jdb=122270672.7.483510958|7.1492611804; __jdc=122270672; mba_muid=483510958; mba_sid=14926117443997004124795642934.9; mobilev=html5; __jdu=483510958; sid=e2b9906d7d7c9ecb7d58f162549e1ba4',
    'Host': 'shop.m.jd.com',
    'Origin': 'https://shop.m.jd.com',
    'Referer': 'https://shop.m.jd.com/search/search?shopId=',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'X-Requested-With': 'XMLHttpRequest'
  }
};

async function getListByPage(searchPage = 1, shopId = '170564') {
  config.headers.Referer = config.headers.Referer + shopId;

  let postData = querystring.stringify({
    shopId,
    searchPage,
    searchSort: 1
  });

  return new Promise((resolve, reject) => {
    let request = http.request(config, (response) => {
      let result = '';
      response.on('data', (chunk) => {
        result += chunk;
      }).on('end', () => {
        resolve(result)
      });
    }).on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
      reject(e);
    });
    request.write(postData);
    request.end();
  });


  return json;
}

// async function getListByPage(searchPage, shopId = '170564') {
//   // 以下js在京东搜索页面内执行正常：
//   // $.ajax({methods:'post',url:'https://shop.m.jd.com/search/searchWareAjax.json',data:{shopId:170564,searchPage:1,searchSort:0}}).then(data=>console.log(data));
//   let headers = spiderSetting.headers.jd;
//   headers.Referer = headers.Referer + shopId;
//   let config = {
//     method: 'post',
//     url: 'https://shop.m.jd.com/search/searchWareAjax.json',
//     data: {
//       shopId,
//       searchPage,
//       searchSort: 1
//     },
//     headers
//   }
//   let json = await axios(config).then(res => res.data);
//   return json;
// }

// 获取商品列表
async function getGoodsList(shopId = '170564') {
  let goodsList = [];
  let totalPage = 1;
  await axios.get('https://shop.m.jd.com/search/search?shopId=170564').then(res=>{
    session = res.headers['set-cookie'];  //获取set-cookie字段值  
    console.log(session);
  })
  for (let i = 1; i <= totalPage; i++) {
    let record = await getListByPage(i,shopId);
    let item = record.results;
    totalPage = item.totalPage;
    // 2017-04-20
    // 此处可考虑将商品名称中属性信息分离存储
    let wareInfo = item.wareInfo.map(item=>{
      item.shopId = shopId;
      return item;
    })
    goodsList = [...goodsList, ...wareInfo];
  }
  return goodsList;
}

module.exports = {
  getGoodsList
};