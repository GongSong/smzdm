let dbName = require('./config').mysql.database;
let rec_date = require('../controller/util/common').getNow;

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
    cncoin_comment_nlp: 'insert into cncoin_comment_nlp (item_id,comment_id,negative,positive) values ?',
    cncoin_comment_seg: 'insert into cncoin_comment_seg (item_id,comment_id,word,wtype,pos) values ?',
    cncoin_question: 'insert into cncoin_question (item_id,content,levelId,account,replyContent,contentType,replyTime,postTime) values ?',
    cncoin_question_nlp: 'insert into cncoin_question_nlp (item_id,account,replyTime,postTime,negative,positive) values ?',
    cncoin_question_seg: 'insert into cncoin_question_seg (item_id,account,replyTime,postTime,word,wtype,pos) values ?',
    cncoin_answer_nlp: 'insert into cncoin_answer_nlp (item_id,account,replyTime,postTime,negative,positive) values ?',
    cncoin_answer_seg: 'insert into cncoin_answer_seg (item_id,account,replyTime,postTime,word,wtype,pos) values ?',
    cncoin_goods: 'insert into cncoin_goods (item_id,good_name,tips,price,rec_date) values ?',
    cncoin_storage: 'insert into cncoin_storage(item_id,value,rec_date) values ?',
    cncoin_goods_detail: 'insert into cncoin_goods_detail (item_id,year,material,weight,theme) values ?',
    cncoin_trade: 'insert into cncoin_trade (item_id,address,access_date,account,quantity,handle_status,order_type,areaid) values ?',
    ccgold_goods_detail: 'insert into ccgold_goods_detail (good_id,good_name,cate_id,weight,img_src,price,inventory,sales,freight,shop_name,rec_date) values ?',

    crawler_list: `insert into crawler_list (tbl_name,rec_date) values ('?','${rec_date()}')`,
};

var update = {

};

var query = {
    wfx_itemid_list: "SELECT a.item_id FROM wfx_stock AS a where DATE_FORMAT(a.rec_date, '%Y%m%d') = (SELECT DISTINCT DATE_FORMAT(a.rec_date, '%Y%m%d') AS lastDate FROM wfx_stock AS a ORDER BY 1 DESC LIMIT 1) order by item_id",
    need_update: "SELECT DATE_FORMAT(rec_date, '%Y%m%d') < DATE_FORMAT(CURDATE(), '%Y%m%d') AS need_update FROM crawler_list where tbl_name= '?' order by 1 limit 1",
    tbl_num: "select substr(a.TABLE_NAME,1,INSTR(TABLE_NAME,'_')-1) as shopName ,count(*) as num from information_schema.TABLES a where TABLE_SCHEMA = '" + dbName + "' group by substr(a.TABLE_NAME,1,INSTR(TABLE_NAME,'_')-1)",
    cncoin_maxid: "SELECT max(item_id) item_id FROM cncoin_goods",
    cncoin_detail_maxid: "SELECT IFNULL(max(item_id),0)  as item_id FROM cncoin_goods_detail",

    // 获取商品交易记录中最后一次记录时间，用于获取交易记录时无需重新获取数据
    // 此处应为 %H:%i:%s %H表示24小时制  不能为 %h:%m:%s m为月，i表示分钟
    // http://blog.163.com/very_apple/blog/static/277592362013283291394/
    // cncoin_trade_list: "SELECT item_id,max(DATE_FORMAT(access_date,'%Y-%m-%d %H:%i:%s')) last_date FROM cncoin_trade group by item_id",
    cncoin_trade_list: "SELECT item_id,max(cast(access_date AS CHAR)) last_date FROM cncoin_trade group by item_id",

    cncoin_comment_maxid: "SELECT item_id,max(comment_id) as comment_id FROM cncoin_comment_list group by item_id",

    //获取最近一次用户咨询信息，由于无question_id等信息，只能以用户名，发送时间，作为标志
    cncoin_question_maxid: "SELECT item_id,max(cast(posttime AS CHAR)) AS last_date FROM  cncoin_question group by item_id"
}

module.exports = {
    insert,
    update,
    query
};