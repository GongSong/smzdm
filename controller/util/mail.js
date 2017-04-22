let mailer = require('nodemailer');
let auth = require('./mailAuth').auth;

let transport = mailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth
    /*
    以下为auth所配置的内容，请自行建立mailAuth.js文件，按以下格式编写
    auth: {
        user: 'yourMail@qq.com',
        pass: 'yourPass'
    }*/
});

async function send(settings) {
    settings.subject = '【什么值得卖】 ' + settings.subject;
    await transport.sendMail({
        from: '"什么值得卖" <realeve@qq.com>',
        to: "nizhen.cbpc@gmail.com,realeve@qq.com",
        subject: settings.subject,
        generateTextFromHTML: true,
        html: settings.html
    }, function(error, response) {
        if (err) { throw err }
        console.log(`邮件 ${settings.subject} 发送成功，Message sent:${ response.message}`);
        transport.close();
    });
}

module.exports = {
    send
}