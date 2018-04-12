/**
 * 定一个排序数组和一个目标值，如果在数组中找到目标值则返回索引。如果没有，返回到它将会被按顺序插入的位置。
 * 你可以假设在数组中无重复元素。
 * */
var searchInsert = function (nums, target) {
  let idx
  let len = nums.length
  if (nums[len - 1] < target) {
    idx = len
  } else {
    for (let i = 0; i < len; i++) {
      if (nums[i] >= target) {
        idx = i
        break
      }
    }
  }
  return idx
}

console.log(searchInsert([1, 3, 5, 6], 2))

