var axios = require('axios');
let fs = require('fs');
let util = require('../util/common');

function genHash(a) {
    var b, c = 1,
        d = 0;
    if (a)
        for (c = 0,
            b = a.length - 1; b >= 0; b--)
            d = a.charCodeAt(b),
            c = (c << 6 & 268435455) + d + (d << 14),
            d = 266338304 & c,
            c = 0 !== d ? c ^ d >> 21 : c;
    return c
}

function getHashDomain() {
    var a = document.domain.replace(/.*?(\w+\.\w+)$/, "$1");
    return genHash(a)
}


function genUuid() {
    return (new Date).getTime() + "" + parseInt(2147483647 * Math.random())
}


function updateMSid(a) {
    lr._mbaSidSeq[0] = (new Date).getTime() + "" + parseInt(1e16 * Math.random());
    lr._mbaSidSeq[1] = a ? 1 : 0;
    lr.ckmba_sid = encodeURI(lr._mbaSidSeq.join("."));
}

function getMSidSeq() {
    var a;
    updateMSid();
    a = (lr._mbaSidSeq || []).slice(0);
    for (var b = 0; b < a.length; b++)
        a[b] = a[b] + "";
    return a
}

function getCookieStr() {
    // let hash = getHash();
    let hash = 122270672;
    let uuid = genUuid();
    let lr = {
        ckJda: "__jda",
        ckJdb: "__jdb",
        ckJdc: "__jdc",
        ckJdv: "__jdv",
        ckJdaExp: 15552000000,
        ckJdbExp: 1800000,
        ckDomain: "jd.com",
        ckJdvEmbeddedExp: 86400000,
        ckJdvExp: 1296000000,
        _mbaSidSeq: []
    }
    let shortTime = uuid.substr(0, 10);
    let k = 1;
    let __jda = [hash, uuid, shortTime, shortTime, shortTime, 1].join(".");
    let __jdb = [hash, k, uuid + "|" + 1, shortTime].join(".");
    let __jdc = hash;
    let __jdv = [hash, "direct", "-", "none", "-", (new Date).getTime()].join("|");
    let __jdu = uuid;
    let mba_muid = uuid;
    let mobilev = 'html5';
    let MSid = (new Date).getTime() + "" + parseInt(1e16 * Math.random());
    let mba_sid = MSid + k;
    let strList = `__jda=${__jda}; __jdb=${__jdb}; __jdc=${__jdc}; __jdv=${__jdv}; __jdu=${__jdu}; mba_muid=${mba_muid}; mba_sid=${mba_sid}; `
    return strList;
}

async function getCookiesFromUrl(shopId, fileName) {
    let cookies = getCookieStr();
    let res = await axios.post('https://mapi.m.jd.com/config/display.action?_format_=json&domain=https://shop.m.jd.com/?shopId=' + shopId).then(res => res);
    let exCookies = res.headers['set-cookie'].filter(item => {
        return item.includes('.jd.hk; Expires=');
    });
    exCookies = exCookies.map(item => item.split(';')[0])
    let cookieStr = cookies + exCookies.join('; ');
    let data = {
        time: (new Date).getTime() / 1000,
        cookieStr
    }
    fs.writeFileSync(fileName, JSON.stringify(data), 'utf8');
    return cookieStr;
}

async function getCookies(shopId) {
    let fileName = `${util.getMainContent()}/controller/data/jdCookie/${shopId}.json`;
    try {
        let str = fs.readFileSync(fileName, 'utf-8');
        let cookieJson = JSON.parse(str);
        let dateDiff = (new Date).getTime() / 1000 - cookieJson.time;
        if (dateDiff > 80000) {
            return await getCookiesFromUrl(shopId, fileName);
        }
        return cookieJson.cookieStr;
    } catch (e) {
        return await getCookiesFromUrl(shopId, fileName);
    }
}

module.exports = {
    getCookies
};