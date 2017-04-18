var axios = require('axios');
var parser = require('../util/htmlParser');

// var spiderSetting = require('../util/spiderSetting');
// var url = require('../util/shopSettings').settings.sge.gold_price;
var sql_lastRecordDate = require('../../schema/sql').query.sge_lastRecordDate;
var query = require('../../schema/mysql');

// 获取一年内历史金价
async function getPriceYearly() {
    let today = new Date();
    console.log('正在抓取' + today.getDate() + '之前一年的每日上海金历史基准价');
    let config = {
        method: 'get',
        url: 'http://www.sge.com.cn/graph/DayilyJzj'
    }
    return await axios(config).then(res => {
        return res.data;
    }).catch(e => console.log(e));
}

async function getLastPriceRecord() {
    return await query(sql_lastRecordDate);
}

function getNewestPriceList() {
    let priceYearly = getPriceYearly();
    let lastRecordDate = getLastPriceRecord();

    if (!lastRecordDate) {
        return priceYearly;
    }

    let milliseconds = isNaN(lastRecordDate) ? 0 : lastRecordDate.getMilliseconds();
    console.log('last record date is ' + milliseconds);
    let priceList = [];
    let i = 0;
    let zp = Reflect.get(priceYearly,'zp');
    let wp = Reflect.get(priceYearly,'wp');
    for (let daily in zp) {
        console.log(daily);
        if (daily[0] > milliseconds) {
            let p = { date: new Date(daily[0]), "zp": daily[1], "wp": wp[i++][1] };
            console.log(p);
            priceList.push(p);
        }
    }
    return priceList;
}

module.exports = {
    getNewestPriceList
};