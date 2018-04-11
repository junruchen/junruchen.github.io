/**
 * 实现一个event bus
 *
 * apis(name参数是字符串，可以同时处理多个事件名，空格隔开):
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
    console.log(this._events)
  }
}

const bus = new Event()
bus.on()

/*

 function Girl () {
 this._events = {}
 }
 Girl.prototype.on = function (eventName, callback) {

 //这里判断他是不是第一次添加(订阅)
 if (this._events[eventName]) {
 this._events[eventName].push(callback)
 } else {
 this._events[eventName] = [callback]
 }
 }
 Girl.prototype.emit = function (eventName, ...args) {
 if (this._events[eventName]) {
 this._events[eventName].forEach(cb => cb(...args))
 }
 }

 let cry = (who) => {
 console.log(who + '哭')
 }
 let shopping = (who) => {
 console.log(who + '购物')
 }
 let eat = (who) => {
 console.log(who + '吃')
 }
 let smile = (who) => {
 console.log(who + '笑')
 }

 let girl1 = new Girl()
 girl1.on('失恋', cry)
 girl1.on('失恋', eat)
 girl1.on('失恋', shopping)
 girl1.emit('失恋', '小明')

 let girl2 = new Girl()
 girl2.on('恋爱', shopping)
 girl2.on('恋爱', smile)
 girl2.emit('恋爱', '小华')
 */

