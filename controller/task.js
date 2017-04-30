let cncoin = require('./task/cncoin');
let ccgold = require('./task/ccgold');
let wfx = require('./task/wfx');
let youzan = require('./task/youzan');
let sge = require('./task/sge');
let jd = require('./task/jd');
let tmall = require('./task/tmall');
let db = require('./task/db');
let mail = require('./util/mail');
let asyncAPI = require('./task/staticData');

async function init() {

    console.log('1.自动化任务队伍已开始,你可以定位到此处添加自己的任务');
    console.log('2.此处需添加任务的定时器，如 setInterval()\n');

    // tmall.init();

    //jd.init();

    // 几个大爷单独传
    // getCbpcData();

    // 每日接口统计内容更新
    asyncAPI.setStaticData();
}

async function getCbpcData() {
    sge.init();
    cncoin.init();
    ccgold.init();
    wfx.init();
    // youzan.init();
    // tmall.init();
}

// 初次执行时初始化数据库，载入默认数据
async function loadDefault() {
    console.log('系统初始化：数据库表单初始化，载入默认数据。此处哪项任务未完成则请自行取消注释信息.');

    // await db.init();

    // ccgold 无需初始化载入数据， 直接加载即可

    //   await cncoin.loadDefault();

    //   wfx.loadDefault();

    //   youzan.loadDefault();
    // tmall.loadDefault();
}


module.exports = {
    init,
    loadDefault
};