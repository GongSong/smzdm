let query = '../schema/mysql.js';
let sql = '../schema/sql.js';

async function handleGoodsData(arr) {
  return await query('select * from yz_goods', function (err, vals, fields) {
    console.log(vals);
    console.log(fields);
    return vals;
  });
}

module.exports = {
  handleGoodsData
};
