let sql = require('../../schema/sql.js')
let getNow = require('./common').getNow;
// 本模块用于一次性插入大量数据时对原始数据的处理

function handleGoodsData(obj) {
    let url = sql.insert.yz_goods
    let rec_date = getNow()
    let sqlValues = obj.data.map(item => {
        return `('${item.alias}',${item.goodId},'${item.title}',${item.price},${item.priceTaobao},'${item.imgSrc}','${item.isVirtual}','${obj.shopName}','${rec_date}')`
    })
    url = url.replace('?', sqlValues.join(','))
    return url
}

function handleStockData(obj) {
    let url = sql.insert.yz_stock
    let rec_date = getNow()
    let sqlValues = obj.data.map(item => {
        return `('${item.alias}',${item.goodId},${item.sales},${item.stock},'${item.freight}','${rec_date}','${obj.shopName}')`
    })
    url = url.replace('?', sqlValues.join(','))
    return url
}

// 销售记录详情数据
function handleSaleDetailData(saleInfo) {
    let url = sql.insert.yz_trade_record
    let lastTimeStr = '';
    let sqlValues = saleInfo.data.map(item => {

        // 处理原始销售记录中未输出年份的问题
        let time = item.update_time
        time = ((time.substr(0, 2) > '03') ? '2016-' : '2017-') + time

        // 默认大于3月为2016年，否则为2017年，数据列表中有2-29这样的非法日期，事实上应为2016或2015年的销售记录
        if (lastTimeStr !== '') {
            if (time > lastTimeStr) {
                time = lastTimeStr;
            }
        }
        lastTimeStr = time;

        return `('${saleInfo.alias}',${saleInfo.goodId},'${item.nickname}',${item.item_num},${item.item_price},'${time}','${saleInfo.shopName}')`
    })
    url = url.replace('?', sqlValues.join(','))
    return url
}

function handleWfxStockData(obj) {
    let url = sql.insert.wfx_stock
    let rec_date = getNow()
    let sqlValues = obj.data.map(item => {
        return `(${item.category_id},${item.item_id},'${item.title}',${item.status},${item.num},${item.original_price},${item.price},${item.sales_volume},'${item.pic_url}','${item.link_item}','${rec_date}')`
    })
    url = url.replace('?', sqlValues.join(','))
    return url
}

/**
 * 整理微分销评论数据插入表的sql
 * @param {*} obj 入参以json格式传入
 */
function handleWfxCommentList(obj) {
    let url = sql.insert.wfx_comment_list;
    let sqlValues = `(${obj.item_id},${obj.order_item_id},'${obj.detail}','${obj.create_time}')`;
    url = url.replace('?', sqlValues);
    return url;
}

/**
 * 整理微分销评论自然语言分析插入表的sql
 * @param {*} obj 入参一json格式传入
 */
function handleWfxCommentNlp(obj) {
    let url = sql.insert.wfx_comment_nlp;
    let sqlValues = `(${obj.item_id},${obj.commentid},${obj.negative},${obj.positive})`;
    url = url.replace('?', sqlValues);
    return url;
}

/**
 * 整理微分销评论分词插入表的sql
 * @param {*} obj 入参一json格式传入
 */
function handleWfxCommentSeg(obj) {
    let url = sql.insert.wfx_comment_seg;
    let sqlValues = `(${obj.item_id},${obj.commentid},${obj.word})`;
    url = url.replace('?', sqlValues);
    return url;
}

function handleCncoinCommentStat(obj) {
    let url = sql.insert.cncoin_comment_stat;
    let rec_date = getNow()
    let sqlValues = `(${obj.item_id},${obj.allNumber},${obj.count},${obj.goodNumber},${obj.pageNo},${obj.middleNumber},${obj.imageNumber},${obj.badNumber},'${rec_date}')`;
    url = url.replace('?', sqlValues);
    return url;
}

function handleCncoinCommentList(obj) {
    let url = sql.insert.cncoin_comment_list;
    let sqlValues = `(${obj.item_id},${obj.comment_id},${obj.levelId},${obj.countByNumber},${obj.comment_type},'${obj.content}',${obj.comment_rank},'${obj.access_date}',${obj.average_points},'${obj.account}','${obj.add_time}')`;
    url = url.replace('?', sqlValues);
    return url;
}

module.exports = {
    handleSaleDetailData,
    handleStockData,
    handleGoodsData,
    handleWfxStockData,
    handleWfxCommentList,
    handleWfxCommentNlp,
    handleWfxCommentSeg,
    handleCncoinCommentStat,
    handleCncoinCommentList
}let sql = require('../../schema/sql.js')
let getNow = require('./common').getNow;
// 本模块用于一次性插入大量数据时对原始数据的处理

function handleGoodsData(obj) {
    let url = sql.insert.yz_goods
    let rec_date = getNow()
    let sqlValues = obj.data.map(item => {
        return `('${item.alias}',${item.goodId},'${item.title}',${item.price},${item.priceTaobao},'${item.imgSrc}','${item.isVirtual}','${obj.shopName}','${rec_date}')`
    })
    url = url.replace('?', sqlValues.join(','))
    return url
}

function handleStockData(obj) {
    let url = sql.insert.yz_stock
    let rec_date = getNow()
    let sqlValues = obj.data.map(item => {
        return `('${item.alias}',${item.goodId},${item.sales},${item.stock},'${item.freight}','${rec_date}','${obj.shopName}')`
    })
    url = url.replace('?', sqlValues.join(','))
    return url
}

// 销售记录详情数据
function handleSaleDetailData(saleInfo) {
    let url = sql.insert.yz_trade_record
    let lastTimeStr = '';
    let sqlValues = saleInfo.data.map(item => {

        // 处理原始销售记录中未输出年份的问题
        let time = item.update_time
        time = ((time.substr(0, 2) > '03') ? '2016-' : '2017-') + time

        // 默认大于3月为2016年，否则为2017年，数据列表中有2-29这样的非法日期，事实上应为2016或2015年的销售记录
        if (lastTimeStr !== '') {
            if (time > lastTimeStr) {
                time = lastTimeStr;
            }
        }
        lastTimeStr = time;

        return `('${saleInfo.alias}',${saleInfo.goodId},'${item.nickname}',${item.item_num},${item.item_price},'${time}','${saleInfo.shopName}')`
    })
    url = url.replace('?', sqlValues.join(','))
    return url
}

function handleWfxStockData(obj) {
    let url = sql.insert.wfx_stock
    let rec_date = getNow()
    let sqlValues = obj.data.map(item => {
        return `(${item.category_id},${item.item_id},'${item.title}',${item.status},${item.num},${item.original_price},${item.price},${item.sales_volume},'${item.pic_url}','${item.link_item}','${rec_date}')`
    })
    url = url.replace('?', sqlValues.join(','))
    return url
}

/**
 * 整理微分销评论数据插入表的sql
 * @param {*} obj 入参以json格式传入
 */
function handleWfxCommentList(obj){
    let url = sql.insert.wfx_comment_list;
    let sqlValues = `(${obj.item_id},${obj.order_item_id},'${obj.detail}','${obj.create_time}')`;
    url = url.replace('?',sqlValues);
    return url;
}

/**
 * 整理微分销评论自然语言分析插入表的sql
 * @param {*} obj 入参一json格式传入
 */
function handleWfxCommentNlp(obj){
    let url = sql.insert.wfx_comment_nlp;
    let sqlValues = `(${obj.item_id},${obj.comment_id},${obj.negative},${obj.positive})`;
    url = url.replace('?',sqlValues);
    return url;
}

/**
 * 整理微分销评论分词插入表的sql
 * @param {*} obj 入参一json格式传入
 */
function handleWfxCommentSeg(obj){
    let url = sql.insert.wfx_comment_seg;
    let sqlValues = `(${obj.item_id},${obj.comment_id},'${obj.word}','${obj.wtype}',${obj.pos})`;
    url = url.replace('?',sqlValues);
    return url;
}

module.exports = {
    handleSaleDetailData,
    handleStockData,
    handleGoodsData,
    handleWfxStockData,
    handleWfxCommentList,
    handleWfxCommentNlp,
    handleWfxCommentSeg
}