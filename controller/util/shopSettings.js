let settings ={
    shanghai:{
        homePage:'https://h5.youzan.com/v2/showcase/homepage?kdt_id=4113179',
        goodList:'https://h5.youzan.com/v2/showcase/tag?alias=8vcj4vsg',
        stockPage:'https://h5.youzan.com/v2/showcase/goods?alias=1yjz9c3yy6z4r',
        saleDetail:'https://h5.youzan.com/v2/showcase/goodsfast?alias=1yjz9c3yy6z4r'
    },
    shenyang:{
        // http://2022030.wxfenxiao.com/Shop/index/sid/2022030/pid/9746959.html
        homePage:'http://www.symint615.com/Shop/index/sid/2022030/pid/9746959.html',
        goodList:'http://www.symint615.com/Item/lists/sid/2022030.html?pid=9863600',
        stockPage:'http://www.symint615.com/Item/detail/id/2746626/page/1/sid/2022030.html?pid=0',
        saleDetail:'http://www.symint615.com/Item/detail/id/2740519/sid/2022030.html?pid=0'
        // 无销售详情，仅有评价记录
        // 南京，1.详情无法打开；2.需微信身份认证
    },
    xian:{
        homePage:'https://weidian.com/?userid=949252882&wfr=wechatpo_welcome_shop',
        goodList:'https://weidian.com/item_classes.html?userid=949252882&c=81610963',
        saleDetail:'https://weidian.com/item.html?itemID=2051674991&pc=1'
    },
    chengdu:{
        homePage:'http://www.ccgold.cn/shop/',
        goodList:'http://www.ccgold.cn/shop/index.php?url=search&fun=index&cate_id=2',
        // cate_id =2/3/4
        saleDetail:'http://www.ccgold.cn/shop/index.php?url=goods&fun=index&goods_id=1709'
    }
}
module.exports = {
    headers
}