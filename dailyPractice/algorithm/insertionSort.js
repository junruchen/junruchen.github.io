/**
 * 插入排序
 * */
function insertionSort (arr) {
  let len = arr.length
  let newArr = [arr[0]]
  for (let i = 1; i < len; i++) {
    let key = arr[i]
    let j = i - 1
    while (j >= 0 && newArr[j] >= key) {
      // 换位置
      newArr[j + 1] = newArr[j]
      j--
    }
    newArr[j + 1] = key
  }
  return newArr
}

insertionSort([2, 6, 9, 4, 2, 1, 5])