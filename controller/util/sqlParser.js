let sql = require('../../schema/sql.js')
let getNow = require('./common').getNow
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
    let lastTimeStr = ''
    let sqlValues = saleInfo.data.map(item => {

        // 处理原始销售记录中未输出年份的问题
        let time = item.update_time
        time = ((time.substr(0, 2) > '03') ? '2016-' : '2017-') + time

        // 默认大于3月为2016年，否则为2017年，数据列表中有2-29这样的非法日期，事实上应为2016或2015年的销售记录
        if (lastTimeStr !== '') {
            if (time > lastTimeStr) {
                time = lastTimeStr
            }
        }
        lastTimeStr = time

        return `('${saleInfo.alias}',${saleInfo.goodId},'${item.nickname}',${item.item_num},${item.item_price},'${time}','${saleInfo.shopName}')`
    })
    url = url.replace('?', sqlValues.join(','))
    return url
}

function handleWfxStockData(data) {
    let url = sql.insert.wfx_stock
    let rec_date = getNow()
    let sqlValues = data.map(item => {
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
    let url = sql.insert.wfx_comment_list
    let sqlValues = `(${obj.item_id},${obj.order_item_id},'${obj.detail}','${obj.create_time}')`
    url = url.replace('?', sqlValues)
    return url
}

/**
 * 整理微分销评论自然语言分析插入表的sql
 * @param {*} obj 入参一json格式传入
 */
function handleWfxCommentNlp(obj) {
    let url = sql.insert.wfx_comment_nlp
    let sqlValues = `(${obj.item_id},${obj.comment_id},${obj.negative},${obj.positive})`
    url = url.replace('?', sqlValues)
    return url
}

/**
 * 整理微分销评论分词插入表的sql
 * @param {*} obj 入参一json格式传入
 */
function handleWfxCommentSeg(obj) {
    let url = sql.insert.wfx_comment_seg
    let sqlValues = `(${obj.item_id},${obj.comment_id},'${obj.word}',${obj.pos})`
    url = url.replace('?', sqlValues)
    return url
}

function handleWfxDetail(obj) {
    let url = sql.insert.wfx_detail
    let sqlValue = `(${obj.item_id},${obj.share},${obj.score},'${obj.remark}',${obj.freight},'${obj.rec_date}')`
    url = url.replace('?', sqlValue)
    return url
}

/**
 * 整理长城商品上期入库sql
 * @param {*} obj 
 */
function handelCcgoldGoodsDetail(obj) {
    let url = sql.insert.ccgold_goods_detail
    let sqlValues = `(${obj.goods_id},'${obj.good_name}',${obj.cate_id},'${obj.weight}','${obj.img}',${obj.price},${obj.stock},${obj.sale_num},${obj.freight},'${obj.shop_name}','${obj.rec_date}')`
    url = url.replace('?', sqlValues)
    return url
}

function handleCncoinCommentStat(obj) {
    let url = sql.insert.cncoin_comment_stat
    let rec_date = getNow()
    let sqlValues = `(${obj.item_id},${obj.allNumber},${obj.count},${obj.goodNumber},${obj.pageNo},${obj.middleNumber},${obj.imageNumber},${obj.badNumber},'${rec_date}')`
    url = url.replace('?', sqlValues)
    return url
}

function handleCncoinCommentList(obj) {
    let url = sql.insert.cncoin_comment_list
    let sqlValues = `(${obj.item_id},${obj.comment_id},${obj.levelId},${obj.countByNumber},${obj.comment_type},'${obj.content}',${obj.comment_rank},'${obj.access_date}',${obj.average_points},'${obj.account}','${obj.add_time}')`
    url = url.replace('?', sqlValues)
    return url
}

function handleCncoinGoodsList(obj) {
    let url = sql.insert.cncoin_goods
    let rec_date = getNow()
    let sqlValues = `(${obj.item_id},'${obj.name}','${obj.tips}',${obj.price},'${rec_date}')`
    url = url.replace('?', sqlValues)
    return url
}

function handleCncoinStorage(obj) {
    let url = sql.insert.cncoin_storage
    let sqlValues = `(${obj.item_id},${obj.value},'${obj.rec_date}')`
    url = url.replace('?', sqlValues)
    return url
}

function handleCncoinDetail(obj) {
    let url = sql.insert.cncoin_goods_detail
    let sqlValues = `(${obj.item_id},'${obj.year}','${obj.material}','${obj.weight}','${obj.theme}')`
    url = url.replace('?', sqlValues)
    return url
}

function handleCncoinTrade(obj) {
    let url = sql.insert.cncoin_trade
    let sqlValues = `(${obj.item_id},'${obj.address}','${obj.access_date}','${obj.account}',${obj.quantity},${obj.handle_status},'${obj.order_type}','${obj.areaid}')`
    url = url.replace('?', sqlValues)
    return url
}

function handleCncoinQuestion(obj) {
    let url = sql.insert.cncoin_question
    let sqlValues = `(${obj.item_id},'${obj.content}',${obj.levelId},'${obj.account}','${obj.replyContent}','${obj.contentType}','${obj.replyTime}','${obj.postTime}')`
    url = url.replace('?', sqlValues)
    return url
}

// type=1 时，客服回答信息
function handleCncoinQuestionSeg(question, type = 0) {
    let url = type ? sql.insert.cncoin_answer_seg : sql.insert.cncoin_question_seg
    let sqlList = question.tokens.map(item => {
        if (item != null) {
            item.word = item.word.replace('\\', '\\\\')
            return `(${question.item_id},'${question.account}','${question.replyTime}','${question.postTime}','${item.word}','${item.wtype}',${item.pos})`
        }
    })
    if (sqlList[0] == undefined) {
        return false
    }
    url = url.replace('?', sqlList.join(','))
    return url
}

// type=1 时，客服回答信息
function handleCncoinQuestionNlp(obj, type = 0) {
    let url = type ? sql.insert.cncoin_answer_nlp : sql.insert.cncoin_question_nlp
    let sqlValues = `(${obj.item_id},'${obj.account}','${obj.replyTime}','${obj.postTime}',${obj.negative},${obj.positive})`
    url = url.replace('?', sqlValues)
    return url
}

function handleCncoinCommentSeg(question) {
    let url = sql.insert.cncoin_comment_seg
    let sqlList = question.tokens.map(item => {
        if (item != null) {
            item.word = item.word.replace('\\', '\\\\')
            return `(${question.item_id},${question.comment_id},'${item.word}','${item.wtype}',${item.pos})`
        }
    })
    if (sqlList[0] == undefined) {
        return false
    }
    url = url.replace('?', sqlList.join(','))
    return url
}

function handleCncoinCommentNlp(obj) {
    let url = sql.insert.cncoin_comment_nlp
    let sqlValues = `(${obj.item_id},${obj.comment_id},${obj.negative},${obj.positive})`
    url = url.replace('?', sqlValues)
    return url
}

function handleSGEData(arr) {
    let url = sql.insert.sge
    let sqlValues = arr.map(item => {
        return `('${item.history_date}',${item.zp},${item.wp})`
    })
    url = url.replace('?', sqlValues.join(','))
    return url
}

function handleJDGoods(data) {
    let url = sql.insert.jd_goods;
    let rec_date = getNow();
    let sqlList = data.map((item, i) => `(${item.shopId},${item.wareId},'${item.wname}','${item.imageurl}',${item.jdPrice},'${item.good}',${item.flashSale},${item.totalCount},${i+1},'${rec_date}')`)
    url = url.replace('?', sqlList.join(','));
    return url;
}

function handleJDCommentList(data) {
    let url = sql.insert.jd_comment;
    let sqlList = data.map(item => `(${item.wareId},${item.commentId},'${item.commentData.replace(/\r/g,'').replace(/\n/g,'').replace(/'/g,'')}','${item.commentDate}',${item.commentScore},'${item.commentShareUrl}',${item.commentType},'${item.orderDate}','${item.userImgURL}',${item.userLevel},'${item.userNickName}')`);
    url = url.replace('?', sqlList.join(','));
    return url;
}

function handleJDShops(item) {
    let url = sql.insert.jd_shop;
    let sqlList = `(${item.venderId},${item.shopId},'${item.shopName}','${item.companyName}','${item.shopDate}',${item.commentScore},${item.serviceScore},${item.expressScore},${item.followCount},'${item.logoUrl}','${item.shareLink}',${item.totalNum},'${item.detailUrl}')`
    url = url.replace('?', sqlList);
    return url;
}

function handleJDCategory(data) {
    let url = sql.insert.jd_shop_category;
    let sqlList = data.map(item => `(${item.shopId},${item.id},'${item.title}')`);
    url = url.replace('?', sqlList.join(','));
    return url;
}

module.exports = {
    handleSaleDetailData,
    handleStockData,
    handleGoodsData,
    handleWfxStockData,
    handleWfxDetail,
    handleWfxCommentList,
    handleWfxCommentNlp,
    handleWfxCommentSeg,
    handleCncoinCommentStat,
    handleCncoinCommentList,
    handleCncoinGoodsList,
    handleCncoinStorage,
    handleCncoinDetail,
    handleCncoinTrade,
    handleCncoinQuestion,
    // handelCcgoldGoodsList,
    handelCcgoldGoodsDetail,
    handleCncoinQuestionSeg,
    handleCncoinQuestionNlp,
    handleCncoinCommentSeg,
    handleCncoinCommentNlp,
    handleSGEData,
    handleJDGoods,
    handleJDCommentList,
    handleJDShops,
    handleJDCategory
}