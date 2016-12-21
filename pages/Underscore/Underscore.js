_ = require('underscore');
var list = [{
    "id": "58578c8402334d0967fc977e",
    "desc": "ting",
    "coverSize": {"width": 640, "height": 320}
}, {
    "id": "5856520402334d2f48fc9794",
    "desc": "article",
    "coverSize": {"width": 640, "height": 320}
}, {
    "id": "584e521802334d0072fc973f",
    "desc": "radio",
    "coverSize": {"width": 640, "height": 320}
}];

//context可以改变iteratee内部的this

_.each(list, function (item, idx, list) {
    //_.each/_.forEach(list,iteratee,[context]),对每一项进行处理
    //console.log(item);
});

var newList = _.map(list, function (item, idx, list) {
    //_.map/_.collect(list,iteratee,[context]),对每一个值进行处理,并返回新数组
    return {[idx]: item.id};
});//console.log(newList);

var sum = _.reduce([5, 2, 3], function (memo, item, idx, list) {
    //_.reduce/_.inject/_.foldl(list,iteratee,[memo],[context]), 将list归结为一个单独的数值
    //指定memo,每一次操作返回的值,作为第二次的memo值
    //未指定memo值,则第一个元素作为memo值,且第一个元素不会进行操作
    return memo * item;
});//console.log(sum);

_.reduceRight()







