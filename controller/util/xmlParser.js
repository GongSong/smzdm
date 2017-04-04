let xslt = require('libxslt');
let fs = require('fs');

function goodsListByXslt(html, styleSheetPath) {
    let template = fs.readFileSync(__dirname + '/../' + styleSheetPath, 'utf8');
    let styleSheet = xslt.parse(template);
    html = html.replace('<!doctype html>','').replace(/<img([\w\W]+?)>/g,'<img$1/>').replace(/<meta([\w\W][^/+>]+?)>/g,'<meta$1/>').replace(/<link([\w\W][^/+>]+?)>/g,'<link$1/>').replace(/<script([\w\W]+?)script>/g,'').replace(/<!--([\w\W]+?)-->/g,'').replace(/([&])/g,'&amp;');
    // console.log(html);
    let result = styleSheet.apply(html);
    return JSON.parse(result);
}

module.exports = {
    goodsListByXslt
}