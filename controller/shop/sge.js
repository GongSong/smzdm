let axios = require('axios');
let util = require('../util/common');
let sql_lastRecordDate = require('../../schema/sql').query.sge_lastRecordDate;
let query = require('../../schema/mysql');
let parser = require('../util/sqlParser');

// 获取一年内历史金价
async function getPriceYearly() {
    console.log('正在抓取' + util.getNow() + '之前一年的每日上海金历史基准价');
    let config = {
        method: 'get',
        url: 'http://www.sge.com.cn/graph/DayilyJzj'
    }
    return await axios(config).then(res => res.data).catch(e => console.log(e));
}

async function getNewestPriceList() {
    let priceYearly = await getPriceYearly();
    let lastRecordDate = await query(sql_lastRecordDate);

    if (!lastRecordDate) {
        return priceYearly;
    }

    let milliseconds = isNaN(lastRecordDate) ? 0 : lastRecordDate.getMilliseconds();
    console.log('last record date is ' + milliseconds);
    let priceList = [];
    let i = 0;
    let zp = Reflect.get(priceYearly, 'zp');
    let wp = Reflect.get(priceYearly, 'wp');
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

function formatData(arr) {
    return arr.map(item => {
        return {
            zp: item[1],
            history_date: (new Date(item[0])).toISOString().split('T')[0]
        };
    });
}

async function getGoldPrice() {
    let priceYearly = await getPriceYearly();
    priceYearly = {
        zp: formatData(priceYearly.zp),
        wp: formatData(priceYearly.wp)
    };
    let data = priceYearly.zp.map(zpItem => {
        let wp = priceYearly.wp.filter(wpItem => zpItem.history_date == wpItem.history_date);
        zpItem.wp = (wp.length == 0) ? zpItem.zp : wp[0].zp;
        return zpItem;
    });
    let newestDate = await query(sql_lastRecordDate);
    return (newestDate.his_date == null) ? data : data.filter(item => item.history_date > newestDate.his_date);
}

async function saveGoldPrice(todayPrice) {
    let url = parser.handleSGEData(todayPrice);
    await query(url);
}

module.exports = {
    getNewestPriceList,
    getGoldPrice,
    saveGoldPrice
};