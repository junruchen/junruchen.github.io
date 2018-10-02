//当页面缩小的同时window.innerWidth同比例放大
//采用rem作为单位等同没有变化,而采用px作为单位的会随页面等比例缩小
//在一些安卓机或app中,当修改默认字体大小时会影响布局
//这是因为rem在计算的时候, 1rem = 1 * (baseFontSize / 16) * defaultFontSize
//baseFontSize: 基准数值如100,视觉稿转css的rem时,要除100;如视觉稿200px --> 200/100=2rem
//defaultFontSize: 浏览器默认字体大小,默认16
//16: 浏览器在使用rem计算过程中,会先除以16再乘以默认字体,16是一个基数,默认字体大小通过和16比较实现放大缩小
!function (options) {

  function getDefaultFontSize () {
    var el = document.createElement('div');
    el.style.width = '1rem';
    el.style.display = "none";
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(el);
    var defaultFontSize = parseFloat(window.getComputedStyle(el, null).getPropertyValue('width'));
    el.parentNode.removeChild(el);
    return defaultFontSize;
  }

  function getViewport (doc, docEl) {
    var meta = doc.querySelector('meta[name="viewport"]')
    if (meta) return meta
    meta = doc.createElement('meta')
    meta.setAttribute('name', 'viewport')
    meta.setAttribute('content', 'width=device-width,initial-scale=1,maximum-scale=1, minimum-scale=1,user-scalable=no')
    docEl.firstElementChild.appendChild(meta)
    return meta
  }

  var timeoutId,
    isAndroid = window.navigator.appVersion.match(/android/gi),
    isIPhone = window.navigator.appVersion.match(/iphone/gi),
    doc = document,
    docEl = doc.documentElement,
    metaEl = getViewport(doc, docEl),
    freeze = options.freeze || metaEl.hasAttribute('freeze'),
    baseSize = options.baseSize || 750,
    baseFontSize = options.baseFontSize || 100,
    defaultFontSize = getDefaultFontSize(),
    dpr = window.devicePixelRatio || 1,
    dpr = !freeze ? dpr >= 3 ? 3 : dpr >= 2 ? 2 : 1 : 1,
    scale = 1 / dpr;
  if (!freeze && (isAndroid || isIPhone)) {
    // 设置viewport，进行缩放，达到高清效果
    metaEl.setAttribute('content', 'width=device-width,initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');
    // 设置data-dpr属性，留作的css hack之用
    docEl.setAttribute('data-dpr', dpr);
  }

  var reset = function () {
    //方案一px
    //docEl.style.fontSize = docEl.getBoundingClientRect().width / baseSize * baseFontSize + 'px';
    //方案二%
    var width = docEl.getBoundingClientRect().width  //375
    if (isAndroid || isIPhone) {
      width = width > 540 * dpr ? 540 * dpr : width
    } else {
      width = 375
    }

    var _rem = width / baseSize * baseFontSize;
    docEl.style.fontSize = _rem / defaultFontSize * 100 + '%';
    window.rem = _rem;
  }

  //页面旋转
  window.addEventListener("resize", function () {
    clearTimeout(timeoutId), timeoutId = setTimeout(reset, 300)
  }, false);

  //页面从浏览器的缓存中读取
  window.addEventListener("pageshow", function (e) {
    e.persisted && (clearTimeout(timeoutId), timeoutId = setTimeout(reset, 300))
  }, false);

  //为了重置页面中的字体默认值，不然没有设置font-size的元素会继承html上的font-size，变得很大。
  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = 12 * dpr + 'px';
  } else {
    doc.addEventListener('DOMContentLoaded', function (e) {
      doc.body.style.fontSize = 12 * dpr + 'px';
    }, false);
  }

  reset();

  window.dpr = dpr;

  window.rem2px = function (x) {
    var y = parseFloat(x) * this.rem;
    return "string" == typeof x && x.match(/rem$/) && (y += "px");
  }

  window.px2rem = function (x) {
    var y = parseFloat(x) / this.rem;
    return "string" == typeof x && x.match(/px$/) && (y += "rem");
  }

}(function () {

  //从页面获取参数
  var scripts = document.getElementsByTagName('script'),

    jscript = scripts[scripts.length - 1],

    params = /flexible\.js\?(\d+)\&(\d+)(?:\&([01]))?/.exec(jscript.src),

    baseSize = params && Number(params[1]),

    baseFontSize = params && Number(params[2]),

    freeze = params && Number(params[3]);

  return { baseSize: baseSize, baseFontSize: baseFontSize, freeze: !!freeze }

}());