let util = require('./common')
let cheerio = require('cheerio')

let youzan = {
    goodsList(html) {
        let rec_date = util.getNow()
        let options = {
            html,
            parentNode: '.js-goods-card.goods-card.card',
            children: [{
                node: '.js-goods-buy.buy-response',
                name: 'data',
                formatter(el) {
                    return {
                        title: el.data('title'),
                        alias: el.data('alias'),
                        price: el.data('price'),
                        isVirtual: el.data('isvirtual'),
                        goodId: el.data('id')
                    }
                }
            }, {
                node: '.goods-photo.js-goods-lazy',
                name: 'imgSrc',
                formatter(el) {
                    return el.data('src')
                }
            }, {
                node: '.goods-price-taobao',
                name: 'priceTaobao'
            }],
            formatter(obj) {
                obj.data.imgSrc = obj.imgSrc
                obj.data.priceTaobao = obj.priceTaobao
                obj.data.rec_date = rec_date
                return obj.data
            }
        }
        return util.parseHTML(options)
    },
    goodsDetail(html) {
        let rec_date = util.getNow()
        let options = {
            html,
            parentNode: '.stock-detail dd',
            mode: 1,
            children: [{
                name: 'freight',
                formatter(el) {
                    return el.text().replace(/\n/, '').trim()
                }
            }, {
                name: 'stock'
            }, {
                name: 'sales'
            }],
            formatter(obj) {
                obj.rec_date = rec_date
                return obj
            }
        }
        return util.parseHTML(options)
    }
}

let wfx = {
    // 更新查询方法后，该函数未使用，此处仅用于第1页数据的格式化演示
    goodsList(html) {
        let rec_date = util.getNow()
        let options = {
            html,
            parentNode: 'li.g-box.por',
            children: [{
                node: 'img',
                name: 'pic_url',
                formatter(el) {
                    return el.attr('src')
                }
            }, {
                node: '.addcart.J-goodsAddCart',
                name: 'item_id',
                formatter(el) {
                    return el.data('id')
                }
            }, {
                node: '.goods-detail a',
                name: 'link_item',
                formatter(el) {
                    return el.attr('href')
                }
            }, {
                node: '.goods-detail a',
                name: 'title'
            }, {
                node: '.goodstype .original_price',
                name: 'original_price',
                formatter(el) {
                    return el.text().replace('¥', '')
                }
            }, {
                node: '.nprice label',
                name: 'price'
            }],
            formatter(obj) {
                obj.rec_date = rec_date
                return obj
            }
        }
        return util.parseHTML(options)
    },
    shareInfo(html) {
        let rec_date = util.getNow()
        let $ = cheerio.load(html)
        let dom = $('.otherinfo').eq(1).find('span')

        // regExp相关
        // http://www.w3school.com.cn/jsref/jsref_obj_regexp.asp
        // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#character-classes

        let text = dom.text().replace(/\n/g, '').replace(/\s/g, '');
        let freight = text.match(/运费:¥(\w+)/);
        freight = (freight != null) ? freight[1] : 0;

        let score = text.match(/积分:(\w+)/);
        score = (score != null) ? score[1] : 0;

        //点赞
        let share = $('.shareinfo span').text()

        let remark = text.match(/\((\S+)\)/);
        remark = (remark == null) ? '' : remark[1];

        return {
            freight,
            score,
            share,
            remark,
            rec_date
        }
    },
    // 2017-04-07 symint615升级详情页面，调整评论接口
    // commentInfo(html) {
    //     let options = {
    //         html,
    //         parentNode: '.eva_box',
    //         children: [{
    //             node: 'h2',
    //             name: 'content'
    //         }, {
    //             node: '.comment_time span',
    //             name: 'user'
    //         }, {
    //             node: '.comment_time b',
    //             name: 'comment_time'
    //         }]
    //     }
    //     return util.parseHTML(options)
    // }
    commentInfo(comments, item_id) {
        // 除首页外，其它页无头像信息
        return comments.map(json => {
            return {
                item_id,
                detail: json.detail,
                order_show_id: json.order_show_id,
                order_item_id: json.order_item_id,
                type: json.type,
                status: json.status,
                create_time: json.create_time,
                mobile: json.mobile,
                // portrait: json.head_portrait,
                // user_openid: json.head_portrait.split('/mmopen/')[1].split('/')[0],
                reply: json.reply
            }
        })
    }
}

let ccgold = {
    goodsList(html, cate_id) {
        let rec_date = util.getNow()
        let options = {
            html,
            parentNode: '.box-shadow',
            children: [{
                node: 'a',
                name: 'goodsId',
                formatter(el) {
                    return el.attr('href').split('goods_id=')[1].split('&')[0]
                }
            }, {
                node: 'a',
                name: 'url',
                formatter(el) {
                    return el.attr('href')
                }
            }],
            formatter(data) {
                data.cate_id = cate_id;
                return data;
            }
        }
        return util.parseHTML(options)
    },
    goodsDetail(html, goodsId, cate_id) {
        let rec_date = util.getNow()
        let options = {
            html,
            parentNode: '.detail-container',
            nodeIdx: 0,
            children: [{
                node: '.con-fangDaIMg img',
                name: 'img',
                formatter(el) {
                    return el.data('original')
                }
            }, {
                node: '.shop-name',
                name: 'shop_name'
            }, {
                node: '.thing-name',
                name: 'good_name'
            }, {
                node: '.thing-price-huo',
                name: 'price',
                formatter(el) {
                    return el.text().replace('￥', '').trim()
                }
            }, {
                node: '.spec-item.thing-chi-span.on',
                name: 'weight',
                formatter(el) {
                    let text = el.text().trim();
                    let segText = text.match(/\w+\*\w+g|\w+\w+g/);
                    if (segText != null) {
                        text = segText[0];
                    }
                    return text;
                }
            }, {
                node: '#shy',
                name: 'stock'
            }, {
                node: '.num-ku',
                name: 'sale_num',
                formatter(el) {
                    return el.text().split('销售量')[1].trim()
                }
            }, {
                node: '#nc_kd',
                name: 'freight',
                formatter(el) {
                    let text = el.text().trim();
                    if (text == '卖家承担运费') {
                        return 0;
                    }
                    return text.match(/\d+.\d+/)[0];
                }
            }],
            formatter(item) {
                item.rec_date = rec_date
                item.goods_id = goodsId
                item.cate_id = cate_id
                return item
            }
        }
        return util.parseHTML(options)
    }
}

let cncoin = {
    goodsDetail(html) {
        let $ = cheerio.load(html)
        let goodInfo = {
            year: '',
            material: '',
            weight: '',
            theme: ''
        }
        $('#spsx tr td').each((i, item) => {
            let text = $(item).text().replace(/\t/g, '').replace(/\r\n/g, '').split(':')
            switch (text[0]) {
                case '年份':
                    goodInfo.year = text[1]
                    break
                case '材质':
                    goodInfo.material = text[1]
                    break
                case '规格':
                    goodInfo.weight = text[1]
                    break
                case '题材':
                    goodInfo.theme = text[1]
                    break
            }
        })
        return goodInfo
    },
    question(questions, id) {
        return questions.map(item => {
            // 去除所有html 标签
            item.replyContent = item.replyContent.replace(/<[^>]+>/g, '')
            item.item_id = id
            return item
        })
    },
    comment(content, id) {
        return content.map(obj => {
            let account = obj.accountOn
            Reflect.deleteProperty(obj, 'essence')
            Reflect.deleteProperty(obj, 'image_list')
            Reflect.deleteProperty(obj, 'replyInfosByList')
            Reflect.deleteProperty(obj, 'accountOn')
            Reflect.deleteProperty(obj, 'image_num')
            Reflect.deleteProperty(obj, 'like_Number')
            obj.item_id = id
            obj.account = account
            return obj
        })
    }
}

let jd = {
    getDetailUrl(html) {
        let $ = cheerio.load(html);
        let url = $('#J-tabbar .J-other').attr('url');
        return 'https://shop.m.jd.com' + url;
    },
    getShopDetail(html, detailUrl) {
        let $ = cheerio.load(html);
        let commentScore = 0,
            serviceScore = 0,
            expressScore = 0;

        let score = $('.score-num').text().split('分');
        if (score.length > 2) {
            commentScore = score[0].trim();
            serviceScore = score[1].trim();
            expressScore = score[2].trim();
        }
        let dom = $('.cell-desc');
        let i = dom.length == 3 ? 1 : 0;
        let shopDate = dom.eq(i + 1).text();
        let companyName = dom.eq(i).text();
        return {
            shopDate,
            companyName,
            commentScore,
            serviceScore,
            expressScore,
            detailUrl
        }
    },
    getShopList(html){
        let $ = cheerio.load(html);
        let shopList = [];
        $('.p-shop').each((i,item)=>{
           let id = $(item).data('shopid');
           if(typeof id !='undefined'){
                shopList.push(id);
           }           
        });
        return util.arrUnique(shopList);
    }
}

let shangBi = {
    tradeRecord(html, item_id) {
        let options = {
            html,
            parentNode: '.buy_tab tr',
            children: [{
                node: 'td',
                name: 'data',
                formatter(el) {
                    return {
                        buyer: el.eq(0).text(),
                        order_time: el.eq(1).text(),
                        quantity: el.eq(2).text(),
                        item_id
                    };
                }
            }],
            formatter: res => res.data
        }
        return util.parseHTML(options)
    }
}

module.exports = {
    youzan,
    wfx,
    ccgold,
    cncoin,
    jd,
    shangBi
}