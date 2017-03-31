
var insert={
	yz_goods:'insert into yz_goods (alias,goodId,title,price,priceTaobao,imgSrc,isVirtual) values ?',
	yz_stock:'insert into yz_stock (alias,goodId,sales,stock,freight,rec_date) values ?',
	yz_trade_record:'insert into yz_trade_record (alias,goodId,nickname,item_num,item_price,update_time) values ?'
};

var update ={

};

var query={

}

module.exports = {
	insert,update,query
};