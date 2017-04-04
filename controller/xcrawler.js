var axios = require('axios');
var querystring = require('querystring');
var parser = require('./util/xmlParser');
var tasks = require('./util/crawlerTask.json');

var spiderSetting = require('./util/spiderSetting');

// 测试使用xslt转换html为json输出
async function getGoodsByXslt(alias, page = 1) {
    console.log('xslt:正在抓取第' + page + '页');
    let config = {
        method: 'get',
        url: 'http://www.symint615.com/Item/lists/sid/2022030.html',
        params: {
            p: page
        },
        headers: spiderSetting.headers.wfx
    };
    return await axios(config).then(res => {
        // return res.data;
        let goods = parser.goodsListByXslt(res.data, '/template/symint615_2022030.xslt');
        if (goods.length === 0) {
            return [];
        }
        return goods;
        // return getGoodsByXslt(alias, page + 1).then(res => [...goods, ...res]);
    }).catch(e => console.log(e));
}

// 使用xslt获取商品列表
function getGoodsListByXslt(req, res) {
    // 3nqefbegxt5aj
    let shopid = req.params.id;
    getGoodsByXslt(shopid).then(response => {
        res.json(response);
    });
}

// step1：数据抓取
async function crawlData(taskid) {
    // 此处需要替换为JSON的map对象的查找方法。
    let task = JSON.stringify(tasks[taskid - 1]);
    console.log('1. \n' + task);
    return tasks[taskid - 1];
}

// step2: 数据整理
async function processData(rawData) {
    console.log('2. \n' + JSON.stringify(rawData));
    return rawData;
}

// step3: 数据持久化
async function persistData(objData) {
    console.log('3. \n' + JSON.stringify(objData));
    return objData;
}

// 执行任务
function processTask(req, res) {
    let taskid = req.params.id;
    // 按步骤先后执行：数据抓取 -> 数据处理 -> 持久化 -> 反馈
    // 由于nodejs的异步处理机制和单线程机制，会造成阻塞。
    crawlData(taskid).then(v1 => processData(v1).then(v2 => persistData(v2).then(v3 => res.json(v3))));
}

module.exports = {
    getGoodsListByXslt,
    processTask
};