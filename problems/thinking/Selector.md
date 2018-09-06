问题描述：
- 前后端对接口参数会制定约定与规范，但是开发前期，接口变动大，会出现参数类型与约定不一致的情况，以至在报错时不能准确判断错误原因。
- 如何才能对该种类型的错误进行检测，准确提示错误信息 或 直接纠正参数错误。

想法：Selector
- 存在一个方法 createSelector, 对参数进行比较，最终返回正确的参数
- 接收一个参数 modal, 定义初始的数据类型以及默认值
- modal中, 存在arrTypeMap来纠正前后端参数名称不一致的问题

```
var modal = {
    status: 0,
    data: {
        a: '',
        b: '',
        c: {
            d: 0,
            e: arrTypeMap({}, {
                alias: '',
                handler () {
                }
            })
        },
        f: [{g: ''}]
    }
}
const selector = createSelector(modal)

// res 为测试数据
var res = {
    status: 200,
    data: {
        a: 1,
        b: 'bbb',
        f: [
            ''
        ],
        w: ''
    }
}

// 调用selector方法
selector(res)

// 纠正res错误，返回正确的res:
{
    status: 200,
    data: {
        a: 1,
        b: 'bbb',
        c: {
            d: 0,
            e: []
        },
        f: [
            {g: ''}
        ]
    }
}
```

