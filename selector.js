// 一个想法，有没有一个工具可以检测 接收到的数据类型与设想的类型 是否匹配

var arrTypeMap = () => {

}
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
    f: [
      {g: ''}
    ]
  }
}

// const selector = createSelector(modal)

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
// selector(res)
// =>
var res = {
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