// url:https://list.tmall.com/search_product.htm?q=%B9%F3%BD%F0%CA%F4&type=p&spm=875.7403452.a2227oh.d100&from=mallfp..m_1_searchbutton&sort=d
// 关键字：贵金属

function getData() {
    $.ajax({
        url: 'https://list.tmall.com/m/search_items.htm?page_size=20&page_no=1&q=%B9%F3%BD%F0%CA%F4&type=p&spm=875.7403452.a2227oh.d100&from=mallfp..m_1_searchbutton&sort=d'
    }).then(function(data) {
        console.log(data);
    });
}