
let dataHandler = require('./dataHandler');

function getGoodsData(req,res){
  dataHandler.handleGoodsData().then(data=>{
    res.send(data);
  });
}

module.exports = {
  getGoodsData
};
