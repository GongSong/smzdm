var mysql = require('mysql')
var config = require('config').mysql

var pool = mysql.createPool(config)

function query (sql, callback) {
  pool.getConnection((err, conn) => {

    conn.query(sql.insert, (err, result) => {
      if (err) {
        callback(err)
      }else {
        conn.query(sql, function (qerr, vals, fields) {
          // 释放连接  
          conn.release()
          // 事件驱动回调  
          callback(qerr, vals, fields)
        })
      }
    })
  })
}

module.exports = query
