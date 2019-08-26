/**
 * 判断是否为回文数
 * 121  true
 * -121 false
 */

/**
 * 思路：
 * 1、转成字符串
 * 2、借助数字特性 /10取余后得到的新数与原始相等
 * */

function isPalindromeUseStr (x) {
  if (x === 0) return true
  if (x < 0) return false
  let str = String(x)
  let len = str.length
  for (let i = 0; i < Math.floor(len / 2); i++) {
    if (str[i] !== str[len - i - 1]) {
      return false
    }
  }
  return true
}

function isPalindromeUseMath (x) {
  if (x === 0) return true
  if (x < 0) return false
  let num = 0
  let oriNum = x
  while (oriNum !== 0) {
    num = num * 10 + oriNum % 10
    oriNum = Math.floor(oriNum / 10)
  }
  return num === x
}
console.log(isPalindromeUseMath(1022301))