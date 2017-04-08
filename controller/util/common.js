let cheerio = require('cheerio');
let POSTAG = require('segment').POSTAG;
let axios = require('axios');
let headers = require('./spiderSetting');

function jsRight(sr, rightn) {
    return sr.substring(sr.length - rightn, sr.length)
}

function getNow(type = 1) {
    let date = new Date()

    let a = date.getFullYear()
    let b = jsRight(('0' + (date.getMonth() + 1)), 2)
    let c = jsRight(('0' + date.getDate()), 2)
    let d = jsRight(('0' + date.getHours()), 2)
    let e = jsRight(('0' + date.getMinutes()), 2)
    let f = jsRight(('0' + date.getSeconds()), 2)
    let output
    switch (type) {
        case 0:
            output = a + '年' + b + '月' + c + '日'
            break
        case 1:
            output = a + '-' + b + '-' + c + ' ' + d + ':' + e + ':' + f
            break
        case 2:
            output = a + '年' + b + '月' + c + '日' + d + '时' + e + '分' + f + '秒'
            break
        case 3:
            output = a + '-' + b + '-' + c + ' ' + d + ':' + e
            break
        case 4:
            output = a + '年' + b + '月' + c + '日  ' + d + '时' + e + '分'
            break
        case 5:
            output = b + '/' + c + '/' + a
            break
        case 6:
            output = a + '-' + b + '-' + c
            break
        case 7:
            output = a + '-' + b

            break
        case 8:
            output = a + b + c
            break
    }
    return output
}


/**
 * @param {any} options={
 *  html:'',
 *  parentNode:'', // 主结点
 *  children:{
 *      node:'', //子结点名
 *      name:'', //键值
 *      formatter(selecter) //格式转换,
 *      mode:0/1(0：默认，返回array，数据按children中定义；1：返回object,key按children定义)
 *  }
 * }
 */
function parseHTML(options) {
    let $ = cheerio.load(options.html);
    let data = [];
    let nodeIdx = (Reflect.has(options, 'nodeIdx')) ? options.nodeIdx : 0;

    let parentNode = $(options.parentNode).eq(nodeIdx);

    if (parentNode.length === 0) {
        return data;
    }

    // detail: http://es6.ruanyifeng.com/?search=delete&x=0&y=0#docs/reflect
    if (Reflect.has(options, 'mode')) {
        let data = {};
        parentNode.each((i, pNode) => {
            let item = options.children[i];
            let node = (Reflect.has(item, 'node')) ? $(pNode).find(item.node) : $(pNode);
            data[item.name] = (typeof item.formatter === 'function') ? item.formatter(node) : node.text().trim();
            if (typeof options.formatter == 'function') {
                data = options.formatter(data);
            }
        });
        return data;
    }

    parentNode.each((i, pNode) => {
        let nodeData = {};
        options.children.forEach(item => {
            let node = (Reflect.has(item, 'node')) ? $(pNode).find(item.node) : $(pNode);
            if (typeof item.formatter === 'function') {
                nodeData[item.name] = item.formatter(node);
            } else {
                let text = node.text().trim();
                nodeData[item.name] = text == '' ? 0 : text;
            }
        });

        if (typeof options.formatter == 'function') {
            nodeData = options.formatter(nodeData);
        }
        data.push(nodeData);
    });
    return data;
}

function handleWordSegment(wordList) {
    let words = wordList.map(item => {
        return {
            ps: POSTAG.chsName(item.p).split(' ')[0],
            w: item.w
        };
    });

    let comment = [];
    if (words[0].ps.includes('形容词')) {
        comment.push(words[0].w);
    }

    for (var i = 1; i < words.length; i++) {
        var item = words[i];
        if (item.ps.includes('形容词')) {
            if (words[i - 1].ps.includes('副词')) {
                comment.push(words[i - 1].w + item.w);
            } else {
                comment.push(item.w);
            }
        } else if (item.ps.includes('名词') || item.ps.includes('动词')) {
            if (item.w.length > 1) {
                comment.push(item.w);
            }
        }

    }
    return {
        comment,
        words
    };
}

async function getNegativeWords(content) {
    let dat = { "content": content };
    let config = {
        method: 'post',
        url: 'http://nlp.qq.com/public/wenzhi/api/common_api1469449716.php',
        data: {
            api: 12,
            body_data: JSON.stringify(dat)
        },
        headers: headers.headers.tencent
    };

    return await axios(config).catch(e => console.log(e));

    // var dat = { "content": '我买的是1盎司的，而里面的包装盒却是个1／2盎司的，我是无语了' };
    // $.ajax({
    //     async: true,
    //     type: 'post',
    //     url: '/public/wenzhi/api/common_api1469449716.php',
    //     dataType: 'json',
    //     data: {
    //         'api': '12',
    //         'body_data': JSON.stringify(dat)
    //     },
    //     success: function(data) {
    //         var negative = (Math.round(data["negative"] * 100)).toString() + "%";
    //         var positive = (Math.round(data["positive"] * 100)).toString() + "%";
    //         var ret_neg = "负面 " + negative;
    //         var ret_pos = "正面 " + positive;
    //         console.log(ret_neg);
    //         console.log(ret_pos);
    //     }
    // });
}

module.exports = {
    getNow,
    parseHTML,
    handleWordSegment,
    getNegativeWords
}