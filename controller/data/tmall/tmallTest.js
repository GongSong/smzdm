// 进入 host中的网页，点击全部商品
// 粘贴 jquery文件，运行以下文件。出现允许下载选项点确定。

var app = async function(obj) {
  var total_page = 1;

  function getData(i) {
    var url = obj.host + '/shop/shop_auction_search.do?spm=a320p.7692171.0.0&suid=' + obj.suid + '&sort=s&page_size=24&from=h5&shop_id=110384005&ajson=1&_tm_source=tmallsearch&p=' + i
    $.ajax({
      url,
      async: false,
      dataType: "jsonp",
      callback: "JsonCallback",
    }).then(function(data) {
      var content = JSON.stringify(data);
      total_page = data.total_page;
      var blob = new Blob([content], {
        type: "text/plain;charset=utf-8"
      });
      let filename = obj.suid + '_' + ('0' + i).substr(('0' + i).length - 2, 2) + '.json';
      // 保存为 suid_01.json 的文件名

      saveAs(blob, filename);
      console.log(`${i}/${total_page}已完成`)
    });
  }

  function sleep(ms = 1000) {
    return new Promise(r => setTimeout(r, ms));
  }


  async function downloadData() {
    for (let i = 1; i <= total_page; i++) {
      await getData(i);
      let timeLength = Math.random() * 10000;
      console.log(`休息${timeLength}ms后继续`);
      await sleep(2 + timeLength);
    }
  }

  return {
    download
  };
}

async function test() {

  let taskList = [{
    host: 'https://dongfangjinyu.m.tmall.com',
    suid: 3076976507
  }, {
    host: 'https://dongfangjinyu.m.tmall.com',
    suid: 3076976507
  }];

  for (let i = 0; i < taskList.length; i++) {
    await app.downloadData({
      host: taskList[i].host,
      suid: taskList[i].suid
    });
  }
}

test();
