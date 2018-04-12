/**
 * 实现一个event bus
 *
 * ctx ------ 不懂
 *
 * apis(name参数是字符串，可以同时处理多个事件名，空格隔开):
 *
 * - on(name, cb, ctx)
 * 事件名、回调函数、执行上下文
 * - once(name, cb, ctx)
 * 同on, 但是只会执行一次回调函数
 * - off (name, cb, ctx)
 * 卸载事件，如果只提供一个name，将所有的name清空；如果还提供了cb，将name下的cb清掉； ctx同理；如果什么都没写，就所有事件全部清空
 * - emit(name, arg0, arg1,…)
 * 触发一个事件，第一个是事件名，后面是参数
 *
 * 基本模版
 * class Event {}
 *
 * 基本例子
 * const bus = new Event()
 * bus.on(‘msg ’, () => {})
 * bus.emit(‘msg’, 1)
 * bus.on(‘msg1 msg2 ’, () => {})
 * bus.emit(‘msg1’, 1)
 * bus.emit(‘msg2’, 1)
 */

class Event {
  constructor () {
    this._events = {}
  }

  on (name, cb, ctx) {
    if (!name && typeof name !== 'string') {
      console.log('msg-----不合法')
      return false
    }
    if (!cb) {
      console.log('msg-----未指定回调函数')
      return false
    }
    if (!cb.name) {
      console.log('msg-----传入的回调函数为匿名函数，无法删除')
    }
    let names = name.split(' ')
    names.forEach((n) => {
      if (!this._events[n]) {
        this._events[n] = []
      }
      this._events[n].push(cb)
    })
  }

  once () {
  }

  off (name, cb, ctx) {
    let cbs = this._events[name]
    if (!cbs) {
      return false
    }
    if (!cb) {
      this._events[name] = null
    } else {
      cbs.forEach((item, idx) => {
        if (cb === item) {
          cbs.splice(idx, 1)
        }
      })
    }
  }

  emit (name, ...args) {
    if (!this._events[name]) {
      console.log('msg-----未注册')
      return false
    }
    if (args.length === 0) {
      console.log('msg-----函数不存在或者已经被删除')
      return false
    }
    this._events[name].forEach((cb) => cb(...args))
  }
}

const bus = new Event()

let testFun = (val) => {
  console.log('test-----', val)
}

bus.on('test test2', testFun)
bus.on('test', ()=>{
  console.log('这是一个测试,匿名函数')
})
bus.emit('test', '这是一个测试')
bus.emit('test2', '这是一个测试2')
bus.off('test', testFun)
bus.emit('test', '这是一个测试')