/**
 * 找到key对应的值 重复值取最后一个
 * obj...
 * */
function pickWith0 (...args) {
  let keys = args[0]
  let keyLen = keys.length
  let objLen = args.length
  let obj = {}
  for (let i = 1; i < objLen; i++) {
    if (!isPlainObject(args[i])) break
    for (let k in args[i]) {
      for (let j = 0; j < keyLen; j++) {
        if (typeof keys[j] === 'string') {
          if (k === keys[j]) {
            obj[k] = args[i][k]
          }
        } else {
          for (let kk in keys[j]) {
            if (k === kk) {
              obj[keys[j][kk]] = args[i][k]
            }
          }
        }
      }
    }
  }
  return obj
}

function pickWith (keys, ...args) {
  const keysLen = keys.length
  const objsLen = args.length
  const obj = {}
  for (let i = 0; i < keysLen; i++) {
    let [keyName, aliasName] = getKeyAndAlias(keys[i])
    for (let j = objsLen - 1; j >= 0; j--) {
      const o = args[j]
      if (!isPlainObject(o)) continue
      if (o.hasOwnProperty(keyName)) {
        obj[aliasName] = o[keyName]
        break
      }
    }
    if (!obj.hasOwnProperty(aliasName)) {
      obj[aliasName] = undefined
    }
  }
  return obj
}

function getKeyAndAlias (obj) {
  let key = obj
  let alias = obj
  if (isPlainObject(obj)) {
    key = Object.keys(obj)[0]
    if (key != null) {
      alias = obj[key]
    }
  }
  return Array.isArray(obj) ? obj : [key, alias]
}

function isPlainObject (val) {
  return val != null && typeof val === 'object' && !Array.isArray(val)
}

console.log(isPlainObject(Object.create(null)))
console.log(pickWith([{'a': 'aaaaa'}, 'b', ['c', '123']], {a: 2}, {a: 4, b: 5, c: 8}, undefined))