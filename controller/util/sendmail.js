// npm install send-mail
var sendmail = require('../sendmail')()

sendmail({
  from: 'nizhen.cbpc@gmail.com',
  to: '41192163@qq.com',
  subject: '来了',
  html: 'Mail of test sendmail '
}, function (err, reply) {
  console.log(err && err.stack)
  console.dir(reply)
})

