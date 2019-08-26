/**
 * 整数数字反转
 * 123 => 321
 * -123 => -321
 * 120 => 021
 *
 * 假设我们的环境只能存储得下 32 位的有符号整数，
 * 则其数值范围为 [−231,  231 − 1]。
 * 请根据这个假设，如果反转后整数溢出那么就返回 0。
 * */

/**
 * 思路：
 * 1、转成字符串，反转【for循环】
 * 2、数组的reverse方法
 * 2、利用求余数
 *
 * number 转 number 可清零 Number('1230000') => 123
 * string 转 number 可清除浮点最后的零 String(123.40050) => 123.4005
 * */
function isNumber (val) {
  return typeof val === 'number'
}
function reverseUseStr (x) {
  if (!isNumber(x)) {
    console.log('error----not number')
  }
  if (x === 0) return 0
  let num = x > 0 ? x : -x
  num = String(num).split('').reverse().join('')
  num = x > 0 ? Number(num) : -Number(num)
  if (num > Math.pow(2, 31) - 1 || num < -Math.pow(2, 31)) {
    return 0
  }
  return num
}

function reverseUseStrStupid (x) {
  if (!isNumber(x)) {
    console.log('error----not number')
  }
  if (x === 0) return 0
  let num = String(x)
  let newArr = []
  for (let i = num.length - 1; i >= 0; i--) {
    if (num[i] !== '-') {
      newArr.push(num[i])
    }
  }
  if (x < 0) {
    newArr.unshift('-')
  }
  newArr = Number(newArr.join(''))
  newArr = isNaN(newArr) ? 0 : newArr
  if (newArr > Math.pow(2, 31) - 1 || newArr < -Math.pow(2, 31)) {
    newArr = 0
  }
  return newArr
}

function reverseUseRemainder (x) {
  if (!isNumber(x)) {
    console.log('error----not number')
  }
  if (x === 0) return 0
  let reverseVal = 0
  let abs = x > 0 ? x : -x
  while (abs > 0) {
    reverseVal = reverseVal * 10 + abs % 10
    abs = Math.floor(abs / 10)
  }
  if (reverseVal > Math.pow(2, 31) - 1 || reverseVal < -Math.pow(2, 31)) {
    return 0
  }
  return x > 0 ? reverseVal : -reverseVal
}
console.log(reverseUseStr(-1534460900000))

