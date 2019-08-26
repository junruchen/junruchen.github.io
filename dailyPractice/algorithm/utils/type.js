// 常规对象
function isPlainObject (val) {
  return val != null && typeof val === 'object' && !Array.isArray(val)
}
// 字符串
function isString (val) {
  return typeof val === 'string'
}

// 数字
function isNumber (val) {
  return typeof val === 'number'
}