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

function getCookies() {
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

module.exports = {
    getCookies
};