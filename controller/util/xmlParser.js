let xslt = require('libxslt');
let fs = require('fs');
let cheerio = require('cheerio');

/**
 * 使用XSLT模板将html字符内容转换为JSON对象
 * @param {*} html 
 * @param {*} styleSheetPath 
 */
function goodsListByXslt(html, styleSheetPath) {
    let template = fs.readFileSync(__dirname + '/../' + styleSheetPath, 'utf8');
    let styleSheet = xslt.parse(template);
    // 对于书写不规范的html需要先进行格式整理，使用cheerio获得root DOM对象
    let $ = cheerio.load(html);
    let _html = $('#J-listgoods').html();

    // 尽管使用cheerio对html格式进行了整理，但是仍然有大量书写不规范的标签，主要是没有关闭的img,meta,link,input等标签。使用正则表达式进行去除或者关闭。
    _html = _html.replace(/((<!doctype|<!DOCTYPE)[\w\W]+?>)/g, '').replace(/<img([\w\W]+?[^/])>/g, '<img$1/>').replace(/<meta([\w\W]+?[^/])>/g, '<meta$1/>').replace(/<link([\w\W]+?[^/])>/g, '<link$1/>').replace(/<script([\w\W\n]+?[/])script>/g, '').replace(/<!--([\w\W]+?)-->/g, '').replace(/&/g, '&amp;').replace(/<style>([\w\W]+?)style>/g,'').replace(/<input([\w\W]+?[^/])>/g,'<input$1/>');
    // console.log(_html);
    let result = styleSheet.apply(_html);
    console.log('======\n'+result);
    return JSON.parse(result.trim());
}

module.exports = {
    goodsListByXslt
}