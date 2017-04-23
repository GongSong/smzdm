// 进入 host中的网页，点击全部商品
// 粘贴 jquery文件，运行以下文件。出现允许下载选项点确定。

var host = 'https://ctf.m.tmall.com'
var suid = 407700539;
var total_page = 1;

function getData(i) {
  var url = host + '/shop/shop_auction_search.do?spm=a320p.7692171.0.0&suid=' + suid + '&sort=s&page_size=24&from=h5&shop_id=110384005&ajson=1&_tm_source=tmallsearch&p=' + i
  $.ajax({
    url,
    async: false,
    dataType: "jsonp",
    callback: "JsonCallback",
  }).then(function(data) {
    var content = JSON.stringify(data);
    total_page = data.total_page;
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, ('0' + i).substr(('0' + i).length - 2, 2) + '.json');
    console.log(`${i}/${total_page}已完成`)
  });
}

function sleep(ms = 1000) {
  return new Promise(r => setTimeout(r, ms));
}


async function downloadData() {
  for (let i = 1; i <= total_page; i++) {
    await getData(i);
    await sleep(2000);
  }
}

downloadData()
