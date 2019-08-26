/**
 * 罗马数字转数字
 * I, V, X,  L,  C,   D,   M
 * 1, 5, 10, 50, 100, 500, 1000
 *
 * 正常情况 相加
 * 特殊情况：相邻的右边-左边
 * I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
 * X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。
 * C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
 *
 * IV => 4
 * II => 2
 * LVIII => 58
 * */

/**
 * 思路：
 * 1、
 * */
function romanToInt (s) {
  const roman = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000,
    'IV': 4,
    'IC': 10,
    'XL': 40,
    'XC': 90,
    'CD': 400,
    'CM': 900
  }
  let num = 0
  for (let i = 0; i < s.length; i++) {
    if (s[i - 1] === 'I' && (s[i] === 'V' || s[i] === 'X')) {
      num = num - roman[s[i - 1]] + (roman[s[i]] - roman[s[i - 1]])
    } else if (s[i - 1] === 'X' && (s[i] === 'L' || s[i] === 'C')) {
      num = num - roman[s[i - 1]] + (roman[s[i]] - roman[s[i - 1]])
    } else if (s[i - 1] === 'C' && (s[i] === 'D' || s[i] === 'M')) {
      num = num - roman[s[i - 1]] + (roman[s[i]] - roman[s[i - 1]])
    } else {
      num += roman[s[i]]
    }
  }
  return num
}
console.log(romanToInt('MCMXCIV'))

