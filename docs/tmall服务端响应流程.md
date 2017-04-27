tmall服务端加载流程
1. 浏览器中tmall相关cookies
2. 加载tmall店铺首页，如：https://yongyin.m.tmall.com/
3. 在加载到页面：https://log.mmstat.com/eg.js 时，请求头出现第一个cookies。
    请求头如下：
    GET /eg.js HTTP/1.1
    Host: log.mmstat.com
    Connection: keep-alive
    Pragma: no-cache
    Cache-Control: no-cache
    User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1
    Accept: */*
    Referer: https://yongyin.m.tmall.com/
    Accept-Encoding: gzip, deflate, sdch, br
    Accept-Language: zh-CN,zh;q=0.8,en;q=0.6
    Cookie: cna=+zmEDAchQyUCAcC4Kb0IUiGY; cnaui=45952119; aimx=1O7tDRhNcUwCAcC4Irrpx4Vp_1468715869; aui=45952119

    响应头如下：
    HTTP/1.1 200 OK
    Date: Wed, 26 Apr 2017 11:20:14 GMT
    Content-Type: application/javascript
    Content-Length: 91
    Connection: keep-alive
    ETag: "+zmEDAchQyUCAcC4Kb0IUiGY"
    stag: 1
    Expires: Thu, 01 Jan 1970 00:00:01 GMT
    Cache-Control: no-cache
    Pragma: no-cache

    响应如下：
    window.goldlog=(window.goldlog||{});goldlog.Etag="+zmEDAchQyUCAcC4Kb0IUiGY";goldlog.stag=1;

4. 在加载到页面： https://api.m.tmall.com/h5/mtop.tmall.shop.page.get/4.0/ 时，产生关键cookies
    请求头如下：
    GET /h5/mtop.tmall.shop.page.get/4.0/?v=4.0&api=mtop.tmall.shop.page.get&appKey=12574478&t=1493205614062&callback=mtopjsonp1&type=jsonp&sign=fe12473480f1bd6fb08bda704be7c6eb&data=%7B%22clientRenderVersion%22%3A%2210000%22%2C%22shopId%22%3A%22151220108%22%2C%22params%22%3A%22%22%7D HTTP/1.1
    Host: api.m.tmall.com
    Connection: keep-alive
    Pragma: no-cache
    Cache-Control: no-cache
    User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1
    Accept: */*
    Referer: https://yongyin.m.tmall.com/
    Accept-Encoding: gzip, deflate, sdch, br
    Accept-Language: zh-CN,zh;q=0.8,en;q=0.6
    Cookie: isg=AkBAPtjwDQP08_EH6KzAd660EcjlCmC-C8fiErrRDNvuNeBfYtn0IxYDPycK; l=Ak9PkeQ5y3vXpNpQywkCbjcOX/hZdKOW

    querystring：
    v:4.0
    api:mtop.tmall.shop.page.get
    appKey:12574478
    t:1493205614062
    callback:mtopjsonp1
    type:jsonp
    sign:fe12473480f1bd6fb08bda704be7c6eb
    data:{"clientRenderVersion":"10000","shopId":"151220108","params":""}

    响应头：
    HTTP/1.1 200 OK
    Date: Wed, 26 Apr 2017 11:20:14 GMT
    Content-Type: application/json;charset=UTF-8
    Content-Length: 112
    Connection: keep-alive
    Cache-Control: no-cache
    pragma: no-cache
    Set-Cookie: _m_h5_tk=9a96428ec1fb5f63aaeee15f0a0c3d78_1493208014630; Domain=tmall.com; Expires=Wed, 03-May-2017 11:20:14 GMT; Path=/
    Set-Cookie: _m_h5_tk_enc=c811314b8c48dd54b96787dafcc1c48c; Domain=tmall.com; Expires=Wed, 03-May-2017 11:20:14 GMT; Path=/
    m-retcode: FAIL_SYS_TOKEN_EMPTY
    m-bin-length: 112
    m-content-md5: 0884f122468057127bdf223ac407eb2d
    x-paramkey: mtop.tmall.shop.page.get
    s-rt: 23
    Server: Tengine/Aserver
    Strict-Transport-Security: max-age=31536000
    Timing-Allow-Origin: *

    响应：
    mtopjsonp1({"api":"mtop.tmall.shop.page.get","v":"4.0","ret":["FAIL_SYS_TOKEN_EMPTY::令牌为空"],"data":{}})

    在这个请求响应中，发出请求cookies{isg:AkBAPtjwDQP08_EH6KzAd660EcjlCmC-C8fiErrRDNvuNeBfYtn0IxYDPycK,l:Ak9PkeQ5y3vXpNpQywkCbjcOX/hZdKOW}，返回响应cookies{_m_h5_tk:9a96428ec1fb5f63aaeee15f0a0c3d78_1493208014630,_m_h5_tk_enc:c811314b8c48dd54b96787dafcc1c48c}，有效期7*24小时。

5. 第三个页面请求cookies：https://res.mmstat.com/mp.gif
curl 'https://res.mmstat.com/mp.gif?logtype=2&cache=0.8995217711585632&p=1&o=ios9.1&b=other&w=webkit&s=414x736&mx=&spm-cnt=a320p.7692171&isps=1&ns=0&ues=na&uee=na&rds=na&rde=na&fs=212&dls=231&dle=667&cs=667&ce=843&scs=668&rqs=843&rps=984&rpe=987&dl=988&di=2212&dcles=2212&dclee=2213&dc=na&les=na&lee=na&fp=2030' -H 'Pragma: no-cache' -H 'Accept-Encoding: gzip, deflate, sdch, br' -H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' -H 'Accept: image/webp,image/*,*/*;q=0.8' -H 'Referer: https://yongyin.m.tmall.com/' -H 'Cookie: cna=+zmEDAchQyUCAcC4Kb0IUiGY; cnaui=45952119; aimx=1O7tDRhNcUwCAcC4Irrpx4Vp_1468715869; aui=45952119' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed

6. https://log.mmstat.com/m.gif
curl 'https://log.mmstat.com/m.gif?cna=+zmEDAchQyUCAcC4Kb0IUiGY&logtype=1&title=%u6C38%u94F6%u65D7%u8230%u5E97&cache=56f0d2f&scr=414x736&isbeta=9&spm-cnt=a320p.7692171.0.0&req_url=http%3a%2f%2fyongyin%2em%2etmall%2ecom%2f&cna=&category=&pre=&uidaplus=&b2c_orid=&b2c_auction=&at_isb=1&atp_isdpp=2v151220108&at_ssid=&bbid=&aplus&at_cart=&at_alitrackid=&at_udid=&sc=&wp=aXBob25l&sell=&TBTrack_Id=du%3dnull&jsver=aplus_wap&lver=6.9.22&tag=0&stag=1' -H 'Pragma: no-cache' -H 'Accept-Encoding: gzip, deflate, sdch, br' -H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' -H 'Accept: image/webp,image/*,*/*;q=0.8' -H 'Referer: https://yongyin.m.tmall.com/' -H 'Cookie: cna=+zmEDAchQyUCAcC4Kb0IUiGY; cnaui=45952119; aimx=1O7tDRhNcUwCAcC4Irrpx4Vp_1468715869; aui=45952119' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed

7. 关键，参见步骤4：https://api.m.tmall.com/h5/mtop.tmall.shop.page.get/4.0/
curl 'https://api.m.tmall.com/h5/mtop.tmall.shop.page.get/4.0/?v=4.0&api=mtop.tmall.shop.page.get&appKey=12574478&t=1493205614680&callback=mtopjsonp2&type=jsonp&sign=e4242009625581eb3d15d0f1b81c172d&data=%7B%22clientRenderVersion%22%3A%2210000%22%2C%22shopId%22%3A%22151220108%22%2C%22params%22%3A%22%22%7D' -H 'Pragma: no-cache' -H 'Accept-Encoding: gzip, deflate, sdch, br' -H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' -H 'Accept: */*' -H 'Referer: https://yongyin.m.tmall.com/' -H 'Cookie: cna=+zmEDAchQyUCAcC4Kb0IUiGY; _m_h5_tk=9a96428ec1fb5f63aaeee15f0a0c3d78_1493208014630; _m_h5_tk_enc=c811314b8c48dd54b96787dafcc1c48c; isg=AiEhHrE33PCtnHAEccvxZMcLMOvMDXfJciijUYP2HSiH6kG8yx6lkE8sPqQT; l=AtDQi38UPG58MfU94BSVmyybIAUimbTj' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed
    返回：
    mtopjsonp2({api: "mtop.tmall.shop.page.get", v: "4.0", ret: ["SUCCESS::调用成功"],…})

关键步骤在3、4，通过3、4得到7所需的充要条件请求头cookies：
{m_h5_tk:9a96428ec1fb5f63aaeee15f0a0c3d78_1493208014630
_m_h5_tk_enc:c811314b8c48dd54b96787dafcc1c48c,
cna:+zmEDAchQyUCAcC4Kb0IUiGY,
isg:AiEhHrE33PCtnHAEccvxZMcLMOvMDXfJciijUYP2HSiH6kG8yx6lkE8sPqQT,
l:AtDQi38UPG58MfU94BSVmyybIAUimbTj}