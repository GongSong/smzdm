let axios = require('axios');

let spiderSetting = require('../util/spiderSetting');

let util = require('../util/common');
let goodsList = require('../data/cncoinGoodsList.json');
let MAX_NUM = goodsList.length;

let querystring = require('querystring');
let http = require('http');
let headers = {
    Host: 'www.chinagoldcoin.net',
    Cookie: 'pgv_pvi=5114602496; pgv_si=s7545359360; __utmz=119523675.1491833990.18.13.utmcsr=item.chinagoldcoin.net|utmccn=(referral)|utmcmd=referral|utmcct=/product_detail_68.html; uu_code=cmVhbGV2ZUBxcS5jb20=; foregroundSN=4469382B3793254DE1DFE5F8A7B499A3-n1; lua_nickname=; __utma=119523675.1928653905.1487392583.1491826665.1491833990.18; __utmc=119523675; __utmv=119523675.0; __utmb=119523675.63.9.1491841398836; CARTGOODS=Id%3A121%2Csrc%3A1%2CNum%3A2%26; Hm_lvt_79551d2592621515873edbfb6d98c7c6=1490989155,1491487062,1491747498,1491826190; Hm_lpvt_79551d2592621515873edbfb6d98c7c6=1491842387',
    Origin: 'http://www.chinagoldcoin.net',
    Referer: 'http://www.chinagoldcoin.net/views/pages/cart.jsp',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    'Connection': 'keep-alive',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'Accept-Encoding': 'gzip, deflate'
};

function httpRequest(postData, callback) {
    let config = {
        host: 'www.chinagoldcoin.net',
        method: 'post',
        path: '/views/contents/shop/goods/goods_limit_cart_ajax.jsp',
        headers
    };

    let result = "";
    let req = http.request(config, res => {
        res.on('data', (chunk) => {
            result += chunk;
        });
        res.on('end', function() {
            callback(result);
        });
    }).on('error', e => {
        console.log(e);
    })

    req.write(postData);
    req.end();
}

async function storateData() {
    let postData = querystring.stringify({ goodId: 121, goodsNum: 433, source: 1 });
    await httpRequest(postData, function(data) {
        console.log(data);
    })
}

async function getStorage() {
    let storageNum = [];
    let start = 68;
    MAX_NUM = 68;

    // 返回乱码
    // await storateData();

    // for (let i = start; i <= MAX_NUM; i++) {
    //     let val = await getStorageById(i);
    //     storageNum.push({
    //         id: i,
    //         value: val,
    //         datetime: util.getNow(1)
    //     });
    // }

    // data返回为 yes / no 时为正常
    // 此时同样返回空
    storageNum = await testStorage(68, 2);

    console.log('所有数据读取完毕');
    return storageNum;
}

async function testStorage(goodId, goodsNum) {
    let flag = false;
    let url = 'http://www.chinagoldcoin.net/views/contents/shop/goods/goods_limit_cart_ajax.jsp'
    let config = {
        method: 'POST',
        url,
        data: { goodId, goodsNum, source: 1 },
        headers
    }

    return await axios(config).then(res => {
            console.log('返回数据：' + res.data);
            return res.data == 'yes';
        })
        .catch(e => {
            console.log(e);
        });
}

async function getStorageById(id) {
    let startNum = 0;
    console.log('\n正在读取' + id + '的数据：');
    //千位
    startNum += await getStorageBit(1000, id, startNum);
    console.log('千位：' + startNum);
    //百位
    startNum += await getStorageBit(100, id, startNum);
    console.log('百位：' + startNum);
    startNum += await getStorageBit(10, id, startNum);
    console.log('十位：' + startNum);
    startNum += await getStorageBit(1, id, startNum);
    console.log('个位：' + startNum);
    return startNum;
}

//获取库存值的位数:A*1000+b*100+c*10+d
async function getStorageBit(step, id, startNum = 0) {
    //let step = 1000;
    let bitNum;

    let isFind = false;
    //10000-9000-8000-...-0
    for (let i = step * 10; !isFind && i >= 0; i -= step) {
        bitNum = i;
        isFind = await testStorage(id, i + startNum);
    }
    return bitNum;
}


function test1(req, res) {
    let http = require('http');
    let querystring = require('querystring');
    var postData = querystring.stringify({
        goodId: 68, goodsNum: req.params.num, source: 1
    });
    let config = {
        method: 'POST',
        host: 'www.chinagoldcoin.net',
        path: '/views/contents/shop/goods/goods_limit_cart_ajax.jsp',
        headers: {
            'Host': 'www.chinagoldcoin.net',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:50.0) Gecko/20100101 Firefox/50.0',
            'Accept': '*/*',
            'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'http://www.chinagoldcoin.net/views/pages/cart.jsp',
            'Cookie': '__utma=119523675.229289344.1491834268.1491834268.1491923072.2; __utmz=119523675.1491923072.2.2.utmcsr=item.chinagoldcoin.net|utmccn=(referral)|utmcmd=referral|utmcct=/product_detail_118.html; __utmv=119523675.0; Hm_lvt_79551d2592621515873edbfb6d98c7c6=1491834268,1491921860; foregroundSN=2404C41146F65041307B4FE30C6A8E02-n1; lua_nickname=; Hm_lpvt_79551d2592621515873edbfb6d98c7c6=1491923089; pgv_pvi=9884649472; pgv_si=s2699280384; __utmb=119523675.5.10.1491923072; __utmc=119523675; CARTGOODS=Id%3A118%2Csrc%3A1%2CNum%3A999%26',
            'Connection': 'keep-alive'
        }
    };
    console.log(config);
    let request = http.request(config, (response) => {
        let result = '';
        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            result += chunk;
        });
        response.on('end', () => {
            res.send(result);
            res.end();
            console.log('No more data in response.');
        });
    });
    request.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

    request.write(postData);
    request.end();

}

module.exports = {
    getStorage,
    test1
}