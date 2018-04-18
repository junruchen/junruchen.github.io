import Event from './event.js'

const settings = {
  url: null,
  protocols: null,
  debug: false,
  // 实例化时直接创建连接，无须手动open
  automaticOpen: true,
  // 自动尝试连接
  automaticReconnect: true,
  // 每次尝试连接的事件间隔
  reconnectInterval: 1000,
  // 最大延迟连接的事件间隔
  maxReconnectInterval: 30000,
  // 重新尝试连接的比率
  reconnectDecay: 1.5,
  // 连接超时事件，毫秒值
  timeoutInterval: 2000,
  // 最大连接数
  maxReconnectAttempts: null,
  // 二进制类型，默认blob，或者arraybuffer
  binaryType: 'blob'
}

class WebSocketIO extends Event {
  constructor (url, protocols, options = {}) {
    super()
    if (isPlainObject(protocols)) {
      options = protocols
      protocols = null
    }
    // 设置配置
    this.setConfig(options)

    this.url = url
    // 可以是一个单个的协议名字字符串或者包含多个协议名字字符串的数组。这些字符串用来表示子协议，这样做可以让一个服务器实现多种WebSocket子协议
    this.protocols = protocols
    // 后端指定的子协议
    this.protocol = null
    // websocket的实例
    this.io = null
    // 手动关闭
    this.forcedClose = false
    // 是否被销毁
    this.active = true
    // 重新尝试连接的次数
    this.reconnectAttempts = 0
    // 数据缓存池
    this.polls = []

    // 自动打开连接
    if (this.automaticOpen === true) {
      this.open(false)
    }
  }

  setConfig (options) {
    if (!isPlainObject(options)) return
    // 代理设置选项
    for (let key in settings) {
      if (typeof options[key] !== 'undefined') {
        this[key] = options[key]
      } else if (this[key] == null) {
        this[key] = settings[key]
      }
    }
  }

  start (options) {
    this.setConfig(options)
    this.open(false)
  }

  get readyState () {
    if (this.io) {
      return this.io.readyState
    }
  }

  open (reconnectAttempt) {
    // 已经销毁或已经存在io实例不做处理
    if (!this.active || this.io) return
    try {
      this.io = new WebSocket(this.url, this.protocols)
    } catch (e) {
      this.emit('error', e)
      throw e
    }

    // 再次尝试连接
    if (reconnectAttempt) {
      if (
        this.maxReconnectAttempts &&
        this.reconnectAttempts > this.maxReconnectAttempts
      ) {
        return
      }
    } else {
      this.reconnectAttempts = 0
    }

    // 触发connecting事件，通知正在连接
    this.emit('connecting')
    log('attempt-connect', this)

    // 设置超时
    this.timeId = setTimeout(() => {
      log('connection-timeout', this)
      this.timeoutClosed = true
      this.io.close()
      this.timeoutClosed = false
    }, this.timeoutInterval)

    // 监听WebSocket的回调事件
    attachEvent(this, this.io, reconnectAttempt)
  }

  // 发送数据
  send (data) {
    if (this.readyState === 1) {
      log('send data: ', data, this)
      return this.io.send(data)
    } else {
      console.error('WebSocket实例不存在，请尝试重新连接')
    }
  }

  // 写数据, 会缓存数据, 返回0：直接发送，大于0：缓存，-1：无效状态
  write (type, payload) {
    if (this.readyState === 1) {
      this.send(JSON.stringify({ type, payload }))
      return 0
    } else if (this.active) {
      // 注意内存泄漏
      this.polls.push(JSON.stringify({ type, payload }))
      return this.polls.length
    }
    return -1
  }

  flush () {
    const polls = this.polls
    for (let i = 0, length = polls.length; i < length; i++) {
      this.send(polls[i])
    }
    this.polls = []
  }

  close (reason, code = 1000) {
    if (!this.active) return
    this.forcedClose = true
    if (this.io) {
      this.io.close(code, reason)
    }
  }

  destroy () {
    if (this.active) {
      this.close('destroy')
      this.active = false
    }
  }
}

function attachEvent (ws, io, reconnectAttempt) {
  io.onopen = function (e) {
    clearTimeout(ws.timeId)
    log('open', ws)
    this.reconnectAttempts = 0
    ws.protocol = io.protocol
    ws.emit('open', e)
    ws.flush()
  }

  io.onclose = function (e) {
    clearTimeout(ws.timeId)
    ws.io = null
    if (ws.forcedClose) {
      ws.emit('close', e)
      if (!ws.active) {
        // 通过destroy销毁对象，在执行完事件通知完毕后，清空事件
        ws._events = {}
      }
    } else {
      // 尝试再次拦截
      if (!reconnectAttempt && !ws.timeoutClosed) {
        ws.emit('close', e)
      }

      if (!ws.automaticReconnect) return

      const timeout =
        ws.reconnectInterval * Math.pow(ws.reconnectDecay, ws.reconnectAttempts)
      setTimeout(function () {
        ws.reconnectAttempts++
        ws.open(true)
      }, timeout > ws.maxReconnectInterval ? ws.maxReconnectInterval : timeout)
    }
  }

  io.onmessage = function (e) {
    log('onmessage: ', e.data, ws)
    ws.emit('message', e.data)
    if (typeof e.data === 'string') {
      try {
        const data = JSON.parse(e.data)
        if (data.type) {
          ws.emit(data.type, data.payload)
        }
      } catch (e) {
        log('onmessage: 解析失败，接受的数据不是json格式', ws)
      }
    }
  }

  io.onerror = function (e) {
    log('onerror: ', e, ws)
    ws.emit('error', e)
  }
}

function log (...args) {
  const ws = args[args.length - 1]
  if (ws.debug) {
    const e = args.slice(0, args.length - 1)
    console.log(...e)
  }
}

function isObjectLike (obj) {
  return obj != null && typeof obj === 'object'
}

const objectProto = Object.prototype
const toString = obj => objectProto.toString.call(obj)

function isPlainObject (obj) {
  if (!isObjectLike(obj) || toString(obj) !== '[object Object]') {
    return false
  }
  const proto = Object.getPrototypeOf(obj)
  if (proto === null) {
    return true
  }

  return proto.constructor === Object
}

export default WebSocketIO
