let settings = {
    shanghai: {
        homePage: 'https://h5.youzan.com/v2/showcase/homepage?kdt_id=4113179',
        goodList: 'https://h5.youzan.com/v2/showcase/tag?alias=8vcj4vsg',
        stockPage: 'https://h5.youzan.com/v2/showcase/goods?alias=1yjz9c3yy6z4r',
        saleDetail: 'https://h5.youzan.com/v2/showcase/goodsfast?alias=1yjz9c3yy6z4r'
    },
    shenyang: {
        // http://2022030.wxfenxiao.com/Shop/index/sid/2022030/pid/9746959.html
        homePage: 'http://www.symint615.com/Shop/index/sid/2022030/pid/9746959.html',
        goodList: 'http://www.symint615.com/Item/lists/sid/2022030.html?pid=9863600',
        stockPage: 'http://www.symint615.com/Item/detail/id/2746626/page/1/sid/2022030.html?pid=0',
        saleDetail: 'http://www.symint615.com/Item/detail/id/2740519/sid/2022030.html?pid=0'
            // 无销售详情，仅有评价记录
            // 南京，1.详情无法打开；2.需微信身份认证
    },
    xian: {
        homePage: 'https://weidian.com/?userid=949252882&wfr=wechatpo_welcome_shop',
        goodList: 'https://weidian.com/item_classes.html?userid=949252882&c=81610963',
        saleDetail: 'https://weidian.com/item.html?itemID=2051674991&pc=1'
    },
    chengdu: {
        homePage: 'http://www.ccgold.cn/shop/',
        goodList: 'http://www.ccgold.cn/shop/index.php?url=search&fun=index&cate_id=2',
        // cate_id =2/3/4
        saleDetail: 'http://www.ccgold.cn/shop/index.php?url=goods&fun=index&goods_id=1709'
    },
    jdShenyang: {
        homePage: 'https://mall.jd.com/index-170564.html',
        goodList: 'https://mall.jd.com/view_search-517384-0-5-1-24-1.html',
        goodDetail: 'https://item.jd.com/10325434111.html',
        comment: 'https://club.jd.com/comment/productPageComments.action?productId=10057276779&score=0&sortType=5&page=1&pageSize=100&isShadowSku=0',

        // json
        goodsPrice: 'https://p.3.cn/prices/mgets?skuids=J_10057276779',
        commentJson: 'https://item.m.jd.com/ware/getDetailCommentList.json?wareId=10940760573',
        newComment: 'https://item.m.jd.com/newComments/newCommentsDetail.json',
        /**
         * post
         * wareId:11165603143
            offset:1
            num:10
            type:0
            checkParam:LUIPPTP
         */
        goodsList: 'https://shop.m.jd.com/search/searchWareAjax.json',
        /*
            post
            shopId:170564(沈币)/207641(河南钱币)
            searchPage:1 或 2
            searchSort:0(推荐)/1销量/5新品/2降价/3升价
        */
    },
    cncoin: {
        homePage: 'http://www.chinagoldcoin.net/',
        goodList: 'http://item.chinagoldcoin.net/product_detail_141.html',
        goodDetail: 'http://item.chinagoldcoin.net/product_detail_141.html',
        detailAPI: 'http://item.chinagoldcoin.net/getDetail?_t=1490989744719&detail_id=141',
        comment: 'http://www.chinagoldcoin.net/views/newDetail/detail/new-more-pj.jsp?pageNo=10&pageCount=100&pageSize=4&goodsId=141&type=all',
        saleDetail: 'http://www.chinagoldcoin.net/views/newDetail/detail/new-more-buy.jsp?pageNo=10&pageCount=26234&pageSize=1000&goodsId=121',
        commentUrl: 'http://www.chinagoldcoin.net/views/newDetail/detail/more-zx.jsp?goodsId=121'
    },

    // 上海黄金交易所
    sge: {
        // 金价同步
        gold_price: 'http://www.sge.com.cn/graph/DayilyJzj',
        chart_url: 'https://www.sge.com.cn/sjzx/jzj'
    }
}
module.exports = {
    headers
}