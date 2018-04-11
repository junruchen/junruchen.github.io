/**
 * 要求：将数组中的0取出放到最前面
 * for循环，判断
 * - 当item !== 0 时，判断上一个数字，如果等于0，则记录非0数字的序号
 * - 当item === 0 时，移动位置
 * */
const arr = [1, 0, 1, 3, 0, 0, 9, 7, 6, 0]
function f (arr) {
  if (!Array.isArray(arr)) return arr
  let len = arr.length
  let firstNumIdx = 0
  for (let i = 1; i < len; i++) {
    if (arr[i]) {
      if (!arr[i - 1]) firstNumIdx = i
    } else {
      for (let j = i; j > firstNumIdx; j--) {
        arr[j] = arr[j - 1]
      }
      arr[firstNumIdx] = 0
    }
  }
  return arr
}
console.log(f(arr))