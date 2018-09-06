(function () {
    //基础手机尺寸大小，和设计图有关
    var baseSize = 375;
    //initial-scale=1，页面初始化大小
    var baseScale = 1;
    //html{font-size:16px},html的字体大小
    var baseFontSize = parseInt(window.getComputedStyle(document.documentElement).fontSize);

    //从页面获取参数
    [].some.call(document.getElementsByTagName('script'), function (item) {
        if (item.src) {
            var arr = item.src.split('?');
            var path = arr[0];//js的请求地址
            var alias = item.getAttribute('data-alias');
            if (path.indexOf('resetFontSize.js') > -1 || alias && alias.indexOf('resetFontSize') > -1) {
                if (arr[1]) {//请求参数
                    var params = arr[1].split('&');
                    baseSize = Number(params[0]) || baseSize;
                    baseFontSize = Number(params[1]) || baseFontSize;
                    baseScale = Number(params[2]) || baseScale;
                }
                baseSize = Number(item.getAttribute('data-size')) || baseSize;
                baseScale = Number(item.getAttribute('data-scale')) || baseScale;
                baseFontSize = Number(item.getAttribute('data-fontSize')) || baseFontSize;
                return true;
            }
        }
    });

    var plus = document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;
    if(plus > 400){
        baseFontSize = 18;
    }

    var width = window.innerWidth || document.documentElement.clientWidth;
    document.documentElement.style.fontSize = width * baseFontSize * baseScale / baseSize + 'px';

})();
