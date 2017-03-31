let query = require('../schema/mysql.js')
let sql = require('../schema/sql.js')

function getGoodsData (req, res) {
  query('select * from yz_goods', function (result) {
    let string = JSON.stringify(result)
    json = JSON.parse(string)
    res.send(string);
  })
}

module.exports = {
getGoodsData}
