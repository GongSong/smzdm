var axios = require('axios');
var parser = require('../util/htmlParser');

var headers = require('../util/spiderSetting').headers.sge;
var url = require('../util/shopSettings').settings.sge.gold_price;
var sql_lastRecordDate = require('../../schema/sql').query.sge_lastRecordDate;
var query = require('../../schema/mysql');

// 获取一年内历史金价
async function getPriceYearly() {
    let today = new Date().toString();
    console.log('正在抓取' + today + '之前一年的每日上海金历史基准价');
    let config = {
        method: 'get',
        url,
        headers
    }
    return await axios(config).then(res => {
        return res;
    }).catch(e => console.log(e));
}

async function getLastPriceRecord(){
    return await query(sql_lastRecordDate);
}

function getNewestPriceList(){
    let priceYearly = getPriceYearly();
    let lastRecordDate = getLastPriceRecord();
    
    if(!lastRecordDate){
        return priceYearly;
    }

    let milliseconds = lastRecordDate.getMilliseconds();
    console.log('last record date is ' + milliseconds);
    priceYearly.zp[0].forEach(function(element) {
        console.log(element);
    }, this);
}

module.exports = {
    getNewestPriceList
};