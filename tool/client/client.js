/**
 * 判断当前引擎、浏览器、平台
 *
 * 均存在指定变量中，除了当前使用的被保存了浮点数形式的版本号，其他属性值将保持为0
 *
 * ----------引擎判断 engine---------
 * - Opera
 * 检测window.opera，Opera5以及更高版本都存在该对象，version()记录Opera的版本号
 * - WebKit
 * 由于webkit的用户代理字符串中包含'Gecko'和'KHTML'子字符串，所以先检测webkit再检测gecko和khtml
 * 通过检测用户代理字符串中'AppleWebkit'来确定是否是webkit引擎
 * - KHTML
 * 由于khtml的用户代理字符串中也包含'Gecko'子字符串，所以先检测khtml再检测gecko
 * - Gecko
 * Gecko的版本号不会出现在字符串'Gecko'后面，而是位于字符串'rv:'与一个闭括号之间，且还需判断'Gecko/'后是否跟8个数字
 * - IE
 * IE的版本号位于字符串'MSIE'的后面，一个分号的前面
 *
 * ----------浏览器判断 browser---------
 * - 对于IE、Opera来说，browser中的值等于engine对象中的值
 * - 对于Konqueror来说，browser.konq = engine.khtml，browser.ver = engine.ver
 *
 * */
var client = function () {
  // 保存引擎以及具体的版本号
  var engine = {
    ie: 0,
    gecko: 0,
    webkit: 0,
    khtml: 0,
    opera: 0,
    ver: null
  }

  // 保存主要浏览器属性
  var browser = {
    ie: 0,
    firefox: 0,
    safari: 0,
    konq: 0,
    opera: 0,
    chrome: 0,
    ver: null
  }

  // 保存主要浏览器属性
  var system = {
    win: false,
    mac: false,
    x11: false, // Unix Linux
    // 移动设备
    iphone: false,
    ipod: false,
    ipad: false,
    ios: false,
    android: false,
    nokiaN: false,
    winMobile: false,
    // 游戏系统
    wii: false,
    ps: false
  }

  // -----检测 引擎和浏览器 -----
  let ua = navigator.userAgent

  if (window.opera) {
    // opera
    engine.ver = browser.ver = window.opera.version()
    engine.opera = browser.opera = parseFloat(engine.ver)
  } else if (/AppleWebkit\/(\S+)/.test(ua)) {
    // webkit
    engine.ver = RegExp[$1]
    engine.webkit = parseFloat(engine.ver)

    // 确定是Chrome还是Safari
    if (/Chrome\/(\S+)/.test(ua)) {
      browser.ver = RegExp[$1]
      browser.chrome = parseFloat(browser.ver)
    } else if (/Version\/(\S+)/.test(ua)) {
      browser.ver = RegExp[$1]
      browser.safari = parseFloat(browser.ver)
    } else {
      // 近似确定版本号
      var safariVersion = 1
      if (engine.webkit < 100) {
        safariVersion = 1
      } else if (engine.webkit < 312) {
        safariVersion = 1.2
      } else if (engine.webkit < 412) {
        safariVersion = 1.3
      } else {
        safariVersion = 2
      }
      browser.safari = browser.ver = safariVersion
    }
  } else if (/KHTML\/(\S+)/.test(ua)) {
    // khtml
    engine.ver = browser.ver = RegExp[$1]
    engine.khtml = browser.konq = parseFloat(engine.ver)
  } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
    // opera
    engine.ver = RegExp[$1]
    engine.gecko = parseFloat(engine.ver)

    // 确定是不是Firefox
    if (/Firefox\/(\S+)/.test(ua)) {
      browser.ver = RegExp[$1]
      browser.firefox = parseFloat(browser.ver)
    }
  } else if (/MSIE ([^;]+)/.test(ua)) {
    // ie
    engine.ver = browser.ver = RegExp[$1]
    engine.ie = browser.ie = parseFloat(engine.ver)
  }

  // -----检测 平台 -----
  var p = navigator.platform
  system.win = p.indexOf('Win') === 0
  system.mac = p.indexOf('Mac') === 0
  system.x11 = (p.indexOf('X11') === 0 ) || (p.indexOf('Linux') === 0)

  // 检测windows操作系统
  if (system.win) {
    if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
      if (RegExp['$1'] == 'NT') {
        switch (RegExp['$2']) {
          case '5.0':
            system.win = '2000'
            break
          case '5.1':
            system.win = 'XP'
            break
          case '6.0':
            system.win = 'Vista'
            break
          case '6.1':
            system.win = '7'
            break
          default:
            system.win = 'NT'
            break
        }
      } else if (RegExp['$1'] == '9x') {
        system.win = 'ME'
      } else {
        system.win = RegExp['$1']
      }
    }
  }
  // 移动设备、 windows mobile、iOS、android
  system.iphone = ua.indexOf('iPhone') > -1
  system.ipod = ua.indexOf('iPod') > -1
  system.ipad = ua.indexOf('iPad') > -1
  system.nokiaN = ua.indexOf('NokiaN') > -1

  if (system.win == 'CE') {
    system.winMobile = system.win
  } else if (system.win == 'Ph') {
    if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
      system.win = 'Phone'
      system.winMobile = parseFloat(RegExp['$1'])
    }
  }

  if (system.mac && ua.indexOf('Mobile') > -1) {
    if (/CPU (?:Phone)?OS (\d+_\d+)/.test(ua)){
      system.ios = parseFloat(RegExp.$1.replace('_', '.'))
    } else {
      system.ios = 2
    }
  }

  if (/Android (\d+.\d+)/.test(ua)){
    system.android = parseFloat(RegExp.$1)
  }

  // 游戏设备
  system.wii = ua.indexOf('Wii') > -1
  system.ps = /playstation/i.test(ua)

  return {
    engine: engine,
    browser: browser,
    system: system
  }
}