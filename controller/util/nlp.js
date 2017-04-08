let crypto = require('crypto')
let spider = require('./spiderSetting')

let http = require('http');

let appSecrect = {
    secrectKey: 'jIf1GQUSH0couuojYHxviMsDMoMlyCF7',
    SecretId: 'AKID780hCaEuoXwCHBNS5YqwraKwMbeYHxWu'
}

function tencentAuth(content) {
    /**
     * http://182.254.136.27/yunapi/tools/  腾讯云开放平台API调试工具
     * 此处不能作任何修改
       腾讯API鉴权规则，可借鉴。
       拒绝结果："请求被拒绝，请求重复, 请注意 Nonce 参数两次请求不能重复, Timestamp 与腾讯服务器相差不能超过 2 小时, 腾讯服务器 Timestamp = 1491677126"
       服务端可能方案： 1.timestamp与服务器时间校验，不能超过7200秒；2.如果timestamp被请求过，查询Nonce记录是否相同；3.通过校验由开始计算signature是否通过
     */
    let secrectKey = appSecrect.secrectKey;
    let url = 'wenzhi.api.qcloud.com/v2/index.php?';
    let params = {
        Action: 'TextSentiment',
        Nonce: (Math.random() * 10000000000).toFixed(),
        Region: 'gz',
        SecretId: appSecrect.SecretId,
        Timestamp: ((Date.now()) / 1000).toFixed(),
        content: 'replaceContent',
        type: 1
    }
    let urlStr = url + querystring.stringify(params).replace('replaceContent', content.replace(/ /g, ''));
    let srcStr = 'GET' + urlStr;
    let signStr = crypto.createHmac('sha1', secrectKey).update(srcStr).digest('base64');
    return {
        url: 'https://' + urlStr + '&Signature=' + encodeURIComponent(signStr),
        signStr: encodeURIComponent(signStr)
    };
}

function tencentAuthDemo() {
    // 腾讯官网鉴权测试
    // https://www.qcloud.com/document/api/271/2053
    let secrectKey = 'Gu5t9xGARNpq86cd98joQYCN3Cozk1qA';
    let url = 'cvm.api.qcloud.com/v2/index.php?';
    let params = {
        'Action': 'DescribeInstances',
        Nonce: 11886,
        Region: 'gz',
        SecretId: 'AKIDz8krbsJ5yKBZQpn74WFkmLPx3gnPhESA',
        Timestamp: 1465185768,
        'instanceIds.0': 'ins-09dx96dg',
        'limit': 20,
        'offset': 0,
    }
    let urlStr = url + querystring.stringify(params);
    let srcStr = 'GET' + urlStr;
    let signStr = crypto.createHmac('sha1', secrectKey).update(srcStr).digest('base64');
    return {
        urlStr: 'https://' + urlStr + '&Signature=' + encodeURIComponent(signStr),
        signStr: encodeURIComponent(signStr)
    };
}

/**
 * 腾讯NLP自然语义分析
 * http://nlp.qq.com/semantic.cgi
 */
function tencentNLPAnaly(postData, callback) {
    let config = {
        host: 'nlp.qq.com',
        method: 'post',
        path: '/public/wenzhi/api/common_api1469449716.php',
        headers: spider.headers.tencent
    };

    let result = "";
    let req = http.request(config, res => {
        res.on('data', (chunk) => {
            result += chunk;
        });
        res.on('end', function() {
            result = JSON.parse(result);
            callback(result);
        });
    }).on('error', e => {
        console.log(e);
    })
    req.write(postData);
    req.end();
}

let apiList = {
    TextSentiment: 12
};

module.exports = {
    tencentAuth,
    tencentNLPAnaly,
    apiList
};