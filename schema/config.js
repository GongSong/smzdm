//let fs = require('fs');

// module.exports = {
//   mysql: {
//     host: '104.198.189.47',
//     user: 'msqler',
//     password: '3xia5chu2',
//     database: 'smzdm',
//     port: 3306,
//     ssl:{
//       ca:fs.readFileSync(__dirname + '/pem/server-ca.pem')
//     }
//   }
// };

module.exports = {
    mysql: {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'smzdm',
        port: 3306
    },
    // 将以下标志设为 false 时，不再初始化表单
    needInit: true
};