/**
 * 给定一个数组，一个值，原地移除指定值，并返回数组长度。O(1)
 * */
function removeElement (arr, val) {
  let j = 0
  let len = arr.length
  for (let i = 0; i < len; i++) {
    if (arr[i] !== val) {
      arr[j] = arr[i]
      j++
    }
  }
  return j
}
console.log(removeElement([3, 2, 2, 3], 3))