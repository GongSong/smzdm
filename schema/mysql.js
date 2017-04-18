let mysql = require('mysql')
let config = require('./config').mysql
let logger = require('winston')

let pool = mysql.createPool(config)
let errorHandle = (errInfo, sql = 'none') => {
  if (errInfo) {
    logger.error('Error occured.', {
      time: new Date().toLocaleString(),
      sql,
      errInfo
    })
  }
}

async function query(sql, data, callback) {
  if (typeof data == 'function') {
    callback = data;
  }
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      // 此处应该会由conn.query自动判断data的属性从而决定parse还是callback
      conn.query(sql, data, (err, result) => {
        errorHandle(err, sql);
        conn.release();
        result = JSON.stringify(result);
        result = JSON.parse(result);
        if (typeof callback == 'function') {
          callback(result);
        }
        resolve(result);
      });
    });
  });
}

module.exports = query