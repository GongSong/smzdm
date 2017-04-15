let fs = require('fs');
let http = require('http');
let util = require('../util/common');
let querystring = require('querystring');

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

async function getStorage(start = 1) {
    let goodsList = require('../data/cncoinGoodsList.json');
    let MAX_NUM = goodsList.length;
    let storageNum = [];
    for (let i = start; i <= MAX_NUM; i++) {
        let val = await getStorageById(i);
        storageNum.push({
            item_id: i,
            value: val,
            rec_time: util.getNow(1)
        });
    }

    let fileName = util.getMainContent() + '/controller/data/cncoinStorage/' + util.getNow(8) + '.json';
    fs.writeFileSync(fileName, JSON.stringify(storageNum), 'utf8');

    console.log('所有数据读取完毕');
}

async function testStorage(goodId, goodsNum) {
    let store = await requestStorage(goodId, goodsNum);
    return store.result == 'yes';
}

async function getStorageById(id) {
    console.log('\n正在读取' + id + '的数据：');
    // 如果商品库存为1时，获取无数据说明无统计结果，返回0
    let quickStorage = await requestStorage(id, 1);
    if (quickStorage.result == 'no') {
        console.log('商品' + id + '无数据\n');
        return 0;
    }

    let startNum = 0;

    for (let i = 3; i >= 0; i--) {
        startNum += await getStorageBit(10 ** i, id, startNum);
    }
    console.log(`id:${id},商品件数:${startNum}`);
    return startNum;
}

//获取库存值的位数:A*1000+b*100+c*10+d
async function getStorageBit(step, id, startNum = 0) {
    //let step = 1000;
    let bitNum;

    //10000-9000-8000-...-0
    for (let i = step * 10; i >= 0; i -= step) {
        bitNum = i;
        if (await testStorage(id, i + startNum)) {
            break;
        }
    }
    return bitNum;
}

function requestStorage(goodId, goodsNum) {

    let postData = querystring.stringify({
        goodId,
        goodsNum,
        source: 1
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