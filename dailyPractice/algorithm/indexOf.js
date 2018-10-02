/**
 * 要求：实现indexOf
 * */
const arr = [1, 0, 1, 3, 0, 0, 9, 7, 6, 0]
function indexOf (arr, val) {
  let len = arr.length
  for (let i = 0; i < len; i++) {
    if (arr[i] === val) {
      return i
    }
  }
  return -1
}
console.log(indexOf(arr, 9))
