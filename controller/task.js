let cncoin = require('./task/cncoin');
let ccgold = require('./task/ccgold');
let db = require('./task/db');

async function init() {

    console.log('1.自动化任务队伍已开始,你可以定位到此处添加自己的任务');
    console.log('2.此处需添加任务的定时器，如 setInterval()\n');

    await db.init();

    cncoin.init();
    ccgold.init();
}


module.exports = {
    init
};