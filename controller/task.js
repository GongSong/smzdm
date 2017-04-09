let cncoin = require('./task/cncoin');

async function init() {

    console.log('1.自动化任务队伍已开始,你可以定位到此处添加自己的任务');
    console.log('2.此处需添加任务的定时器，如 setInterval()');
    console.log('3.订单交易信息需注意 handle_note_c 字段，商品id 72\n');

    console.log('解压controller目录中zip文件到cncoinRecord目录下，gitignore已自动设为不上传该目录\n');

    // await cncoin.asyncData();

}


module.exports = {
    init
};