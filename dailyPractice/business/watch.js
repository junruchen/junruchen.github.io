/**
 * 实现一个watch函数，使得当getter中的值改变时，执行回调函数，并把当前值作为参数
 *
 * vue watch的实现
 *
 * function watch(getter, callback) {}
 *
 * 核心 defineProperty
 *
 * */

// 设置defineProperty
function setDefineProperty (obj, key) {
  let val = obj[key]
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    Configurable: true,
    Enumerable: true,
    get: () => {
      if (Dep.target) {
        dep.depend()
      }
      return val
    },
    set: function (newVal) {
      if (val === newVal) return
      else {
        val = newVal
        checkAllProperty(newVal)
        dep.notify()
      }
    }
  })
}
// 设置检查对象自身属性值
function checkAllProperty (obj) {
  if (!obj || typeof obj !== 'object') {
    return
  }
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      checkAllProperty(obj[key])
    } else {
      setDefineProperty(obj, key)
    }
  })
}
// Dep 通知类
class Dep {
  constructor () {
    this.watchers = []
  }
  depend () {
    this.watchers.push(Dep.target)
  }
  notify () {
    const watchers = this.watchers.slice()
    for (let w of watchers) {
      w.update()
    }
  }
}
class Watcher {
  constructor (getter, callback) {
    this.getter = getter
    this.callback = callback
    this.value = this.get()
  }

  get () {
    Dep.target = this
    const val = this.getter()
    Dep.target = null
    return val
  }

  update () {
    const newValue = this.get()
    if (newValue !== this.value) {
      this.callback(newValue, this.value)
      this.value = newValue
    }
  }
}
function watch (getter, callback) {
  return new Watcher(getter, callback)
}

const obj = {
  a: 1,
  b: 30
}
checkAllProperty(obj)

watch(() => {
  return obj.a + obj.b
}, (val) => {
  console.log('cb-----', val)
})

obj.a = 10
obj.b = 20