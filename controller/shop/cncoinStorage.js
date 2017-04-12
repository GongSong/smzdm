let axios = require('axios');

let spiderSetting = require('../util/spiderSetting');

let util = require('../util/common');
let goodsList = require('../data/cncoinGoodsList.json');
let MAX_NUM = goodsList.length;

let querystring = require('querystring');
let http = require('http');
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
        'Connection': 'keep-alive'
    }
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
        res.on('end', function () {
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
    await httpRequest(postData, function (data) {
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

function requestStorage(goodId, goodsNum) {
    // console.log({goodId,goodsNum});

    let postData = querystring.stringify({
        goodId, goodsNum, source: 1
    });

    return new Promise((resolve, reject) => {
        let request = http.request(config, (response) => {
            let result = '';
            let zlib = require('zlib');
            let gunzip = zlib.createGunzip();
            response.pipe(gunzip);
            gunzip.on('data', (chunk) => {
                result += chunk;
            }).on('end', () => {
                resolve({ goodId, goodsNum, result })
            });
        }).on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
            reject(e);
        });

        request.write(postData);
        request.end();
    });
}

module.exports = {
    getStorage,
    requestStorage
}