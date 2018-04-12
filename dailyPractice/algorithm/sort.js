/**
 * 要求：实现数组的sort
 * 默认排序
 * */
const arr = [1, 0, 1, 3, 0, 0, 9, 7, 6, 0]
function sort (arr) {
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
console.log(sort(arr))

