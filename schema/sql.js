var insert = {
    yz_goods: 'insert into yz_goods (alias,goodId,title,price,priceTaobao,imgSrc,isVirtual,shopName,rec_date) values ?',
    yz_stock: 'insert into yz_stock (alias,goodId,sales,stock,freight,rec_date,shopName) values ?',
    yz_trade_record: 'insert into yz_trade_record (alias,goodId,nickname,item_num,item_price,update_time,shopName) values ?',
    wfx_stock: 'insert into wfx_stock(category_id,item_id,title,status,num,original_price,price,sales_volume,pic_url,link_item,rec_date) values ?',
    wfx_comment_list: 'INSERT INTO wfx_comment_list(item_id,order_item_id,detail,create_time) VALUES ?',
    wfx_comment_nlp: 'INSERT INTO wfx_comment_nlp(item_id,comment_id,negative,positive) VALUES ?',
    wfx_comment_seg: 'INSERT INTO wfx_comment_seg(item_id,comment_id,word,pos) VALUES ?',
    cncoin_comment_stat: 'insert into cncoin_comment_stat (item_id,allNumber,count,goodNumber,pageNo,middleNumber,imageNumber,badNumber,rec_date) values ?',
    cncoin_comment_list: 'insert into cncoin_comment_list (item_id,comment_id,levelId,countByNumber,comment_type,content,comment_rank,access_date,average_points,account,add_time) values ?',
    cncoin_comment_nlp: '',
    cncoin_comment_seg: '',
    cncoin_question_list: '',
    cncoin_question_nlp: '',
    cncoin_question_seg: '',
    cncoin_answer_nlp: '',
    cncoin_answer_seg: '',
    cncoin_goods: 'insert into cncoin_goods (item_id,good_name,tips,price,rec_date) values ?'
};

var update = {

};

var query = {
    wfx_itemid_list: "SELECT a.item_id FROM wfx_stock AS a where DATE_FORMAT(a.rec_date, '%Y%m%d') = (SELECT DISTINCT DATE_FORMAT(a.rec_date, '%Y%m%d') AS lastDate FROM wfx_stock AS a ORDER BY 1 DESC LIMIT 1) order by item_id"
}

module.exports = {
    insert,
    update,
    query
};