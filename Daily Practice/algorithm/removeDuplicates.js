/**
 * 给定一个有序数组，需要原地删除其中的重复内容，使每个元素只出现一次,并返回新的长度。
 * 不要另外定义一个数组，您必须通过用 O(1) 额外内存原地修改输入的数组来做到这一点。
 * 示例：
 * 给定数组: nums = [1,1,2],
 * 你的函数应该返回新长度 2, 并且原数组nums的前两个元素必须是1和2,不需要理会新的数组长度后面的元素
 */
const arr = [1, 1, 1, 2, 4, 5, 5, 6, 6, 9, 9] // [1, 2, 4, 5, 6, 9] length = 6
function removeDuplicates (arr) {
  let len = arr.length
  for (let i = 1; i < len; i++) {
    if (arr[i] === arr[i - 1]) {
      for (let j = i; j < len; j++) {
        arr[j] = arr[j + 1]
      }
      i = i - 1
      len--
    }
  }
  arr.length = len
  return len
}

function removeDuplicates1 (arr) {
  let len = arr.length
  let j = 0
  for (let i = 0; i < len; i++) {
    if (arr[i] !== arr[j]) {
      j++
      arr[j] = arr[i]
    }
  }
  console.log(arr)
  return j + 1
}

console.log(removeDuplicates1(arr))


