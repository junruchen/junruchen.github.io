class Event {
  constructor (ctx) {
    this._events = {}
    this._ctx = ctx
  }

  /**
   * 绑定一个事件
   * @param name 事件名
   * @param cb 回调函数
   * @param ctx 上下文
   * @returns {Event}
   */
  on (name, cb, ctx) {
    return eventsOnApi(this, name, cb, ctx, false)
  }

  /**
   * 绑定一个事件,只执行一次
   * @param name 事件名
   * @param cb 回调函数
   * @param ctx 上下文
   * @returns {Event}
   */
  once (name, cb, ctx) {
    return eventsOnApi(this, name, cb, ctx, true)
  }

  /**
   * 卸载一个绑定的事件
   * @param name 事件名
   * @param cb 回调函数
   * @param ctx 上下文
   * @returns {Event}
   */
  off (name, cb, ctx) {
    var events = eventsApi(this, name, cb, ctx)
    for (var key in events) {
      var e = this._events[key]
      events[key].slice().forEach(function (item) {
        e.splice(e.indexOf(item), 1)
      })
    }
    return this
  }

  /**
   * 暂停某个事件，用法同off
   * @param name
   * @param cb
   * @param ctx
   */
  pause (name, cb, ctx) {
    return eventsPauseApi(this, name, cb, ctx, true)
  }

  /**
   * 恢复某个事件，继续触发回调，用法同off
   * @param name
   * @param cb
   * @param ctx
   */
  resume (name, cb, ctx) {
    return eventsPauseApi(this, name, cb, ctx, false)
  }

  emit (name) {
    var _this = this
    if (!name || typeof name !== 'string') return this
    var len = arguments.length
    var args = []
    var i = 1
    while (i < len) {
      args.push(arguments[i++])
    }

    name.split(/\s+/).forEach(function (ename) {
      if (ename && _this._events[ename]) {
        _this._events[ename].slice().forEach(function (handler) {
          if (handler.once) {
            handler.cb.apply(handler.ctx, args)
            _this.off(ename, handler.cb, handler.ctx)
          } else if (!handler.pause) {
            handler.cb.apply(handler.ctx, args)
          }
        })
      }
    })

    return this
  }
}

/**
 * 找到符合规则的事件，off,pause,resume 通用方法
 * @param self Event实例
 * @param name 事件名，可以是空格隔开的多个事件名
 * @param cb 回调函数
 * @param ctx 绑定回调函数的上下文
 * @return events
 */
function eventsApi (self, name, cb, ctx) {
  var events = {}

  // name 存在时，找到所有name下的事件列表
  if (name) {
    name.split(/\s+/).forEach(function (ename) {
      if (ename && self._events[ename]) {
        events[ename] = self._events[ename]
      }
    })
  } else {
    for (var key in self._events) {
      events[key] = self._events[key]
    }
  }

  var keys = Object.keys(events)

  if (keys.length === 0) return events

  if (cb && typeof cb === 'function') {
    keys.forEach(function (key) {
      events[key] = events[key].filter(function (e) {
        return e.cb === cb
      })
    })
  }

  if (ctx) {
    keys.forEach(function (key) {
      events[key] = events[key].filter(function (e) {
        return e.ctx === ctx
      })
    })
  }

  return events
}

// 暂停,恢复通用方法
function eventsPauseApi (self, name, cb, ctx, pause) {
  var events = eventsApi(self, name, cb, ctx)
  for (var key in events) {
    events[key].forEach(function (item) {
      item.pause = pause
    })
  }

  return self
}

/**
 * on,once 通用方法
 * @param self Event实例
 * @param name 事件名，可以是空格隔开的多个事件名
 * @param cb 回调函数
 * @param ctx 绑定回调函数的上下文
 * @param once 是否是once
 * @return self
 */
function eventsOnApi (self, name, cb, ctx, once) {
  if (!name || typeof cb !== 'function' || typeof name !== 'string') return self
  name.split(/\s+/).forEach(function (ename) {
    var handlers = self._events[ename] || []
    handlers.push({
      cb: cb,
      ctx: ctx || self._ctx,
      pause: false,
      once: once
    })
    self._events[ename] = handlers
  })
  return self
}

export default Event
