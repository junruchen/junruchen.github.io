/**
 * 要求：实现indexOf
 * */
const arr = [1, 0, 1, 3, 0, 0, 9, 7, 6, 0]
function indexOf (arr, val) {
  let len = arr.length
  let idx = -1
  for (let i = 0; i < len; i++) {
    if (arr[i] === val) {
      idx = i
      break
    }
  }
  return idx
}
console.log(indexOf(arr, '1'))
