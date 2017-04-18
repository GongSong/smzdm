let cncoin = require('./task/cncoin');
let ccgold = require('./task/ccgold');
let wfx = require('./task/wfx');
let youzan = require('./task/youzan');
let db = require('./task/db');

async function init() {

    console.log('1.自动化任务队伍已开始,你可以定位到此处添加自己的任务');
    console.log('2.此处需添加任务的定时器，如 setInterval()\n');

    // cncoin.init();
    // ccgold.init();
    // wfx.init();
    // youzan.init();
}

// 初次执行时初始化数据库，载入默认数据
async function loadDefault() {
    console.log('系统初始化：数据库表单初始化，载入默认数据。此处哪项任务未完成则请自行取消注释信息.');

    // await db.init();

    // ccgold 无需初始化载入数据，直接加载即可

    // cncoin.loadDefault();

    // wfx.loadDefault();

    // youzan.loadDefault();
}


module.exports = {
    init,
    loadDefault
};