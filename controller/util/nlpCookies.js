let fs = require('fs');

function getMainContent() {
    let PROGRAM_NAME = 'smzdm';
    let str = process.cwd().split(PROGRAM_NAME)[0] + PROGRAM_NAME;
    return str.replace(/\\/g, '/');
}

let content = getMainContent();

function sid(str) {
  return (str || "") + Math.round(2147483647 * (Math.random() || .5)) * +new Date % 1E10
}

function reloadCookies() {
  let fileName = `${content}/controller/data/nlpCookie.json`;
  let cookie = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': `pgv_pvi=${sid()}; pgv_si=${sid('s')}`,
    'Referer': 'http://nlp.qq.com/semantic.cgi'
  };
  let cookieStr = JSON.stringify(cookie);
  
  let data = {
    time: (new Date).getTime() / 1000,
    cookieStr
  }
  fs.writeFileSync(fileName, JSON.stringify(data), 'utf8');
  return cookie;
}

function getCookies() {
  let fileName = `${content}/controller/data/nlpCookie.json`;
  try {
    let str = fs.readFileSync(fileName, 'utf-8');
    let cookieJson = JSON.parse(str);
    let dateDiff = (new Date).getTime() / 1000 - cookieJson.time;
    if (dateDiff > 80000) {
      return reloadCookies();
    }
    return cookieJson.cookieStr;
  } catch (e) {
    return reloadCookies();
  }
}

module.exports = {
  getCookies
}