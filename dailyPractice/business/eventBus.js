/**
 * 实现一个event bus
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
    bindeEvent(this, name, cb, ctx, false)
  }

  once (name, cb, ctx) {
    bindeEvent(this, name, cb, ctx, true)
  }

  off (name, cb, ctx) {
    if (typeof name !== 'string' || typeof cb !== 'function') {
      console.log('msg-----不合法')
      return
    }
    if (!name) {
      this._events = {}
      console.log('msg-----删除全部')
      return
    }
    let names = name.split(' ')
    names.forEach((n) => {
      if (this._events[n]) {
        if (!cb) {
          this._events[n] = null
          console.log('msg-----删除该 ' + n + ' 下所有方法')
        } else {
          let cbs = this._events[n]
          cbs.forEach((h, idx) => {
            if (h.cb === cb) {
              cbs.splice(idx, 1)
              console.log('msg-----删除该 ' + n + ' 下指定方法')
            }
          })
          this._events[n] = cbs
        }
      } else {
        console.log('msg----- ' + n + ' 未注册')
      }
    })
  }

  emit (name, ...args) {
    if (!name || typeof name !== 'string') {
      console.log('msg-----请输入正确的事件名称')
      return
    }

    let names = name.split(' ')
    names.forEach((n) => {
      if (this._events[n]) {
        let cbs = this._events[n]
        cbs.forEach((h, idx) => {
          if (h.ctx) {
            h.cb.apply(h.ctx, ...args)
          } else {
            h.cb(...args)
          }
        })
      } else {
        console.log('msg----- ' + n + ' 未注册')
      }
    })
  }
}

function bindeEvent (self, name, cb, ctx, isOnce) {
  if (!name || typeof name !== 'string' || typeof cb !== 'function') {
    console.log('msg-----不合法')
    return
  }
  if (!cb) {
    console.log('msg-----未指定回调函数')
    return
  }
  if (!cb.name) {
    console.log('msg-----注意传入的回调函数为匿名函数，无法删除')
  }
  let names = name.split(' ')
  names.forEach((n) => {
    if (!self._events[n]) {
      self._events[n] = []
    }
    self._events[n].push({
      cb: cb,
      ctx: ctx || '',
      once: isOnce
    })
  })
}

const bus = new Event()
let testFun = (val) => {
  console.log('test-----', val)
}
bus.on('test test2', testFun)
bus.once('test', () => {
  console.log('匿名函数的测试--test')
})
bus.off('test77 test2', testFun)
bus.emit('test test2', '这是一个test测试')