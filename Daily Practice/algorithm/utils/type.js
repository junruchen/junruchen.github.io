// 常规对象
function isPlainObject (val) {
  return val != null && typeof val === 'object' && !Array.isArray(val)
}
console.log(isPlainObject(Object.create(null)))
// 字符串
function isString (val) {
  return typeof val === 'string'
}