// 此段代码仅在网页前端能有效执行
// 未做任何性能优化;

// load: http://cdn.bootcss.com/jquery/2.1.0-beta2/jquery.min.js

// // run it at http://www.chinagoldcoin.net/views/pages/cart.jsp

var MaxNum = 182;

function testStorage(goodId, goodsNum) {
    var flag = false;
    $.ajax({
            url: 'http://www.chinagoldcoin.net/views/contents/shop/goods/goods_limit_cart_ajax.jsp',
            type: 'POST',
            data: {
                goodId,
                goodsNum,
                source: 1
            },
            async: false
        })
        .done(function(e) {
            flag = (e == 'yes');
        })
        .fail(function(e) {
            console.log(e);
        });
    return flag;
}

var storageNum = [];

function getStorage() {

    for (var i = 1; i <= MaxNum; i++) {
        var val = getStorageById(i);
        storageNum.push({
            id: i,
            value: val
        });
    }
    console.log(storageNum);
    console.log(JSON.stringify(storageNum));
}

function getStorageById(id) {
    var startNum = 0;

    // 如果商品库存为1时，获取无数据说明无统计结果，返回0
    if (!testStorage(id, 1)) {
        return 0;
    }
    //千位
    startNum += getStorageBit(1000, id, startNum);
    console.log('千位：' + startNum);
    //百位
    startNum += getStorageBit(100, id, startNum);
    console.log('百位：' + startNum);
    startNum += getStorageBit(10, id, startNum);
    console.log('十位：' + startNum);
    startNum += getStorageBit(1, id, startNum);
    console.log('个位：' + startNum);
    return startNum;
}

//获取库存值的位数:A*1000+b*100+c*10+d
function getStorageBit(step, id, startNum = 0) {
    //var step = 1000;
    var bitNum;

    var isFind = false;
    //10000-9000-8000-...-0
    for (var i = step * 10; !isFind && i >= 0; i -= step) {
        bitNum = i;
        isFind = testStorage(id, i + startNum);
    }
    console.log(bitNum);
    return bitNum;
}

getStorage();