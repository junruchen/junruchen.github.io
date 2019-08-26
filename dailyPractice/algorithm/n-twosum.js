/**
 * 给定一个整数数组和一个目标值，找出数组中和为目标值的两个数的下标
 * - 元素不可重复利用
 * - 假设每个目标值 只 对应一个答案
 *
 * 如：nums=[2, 2, 11, 15], target=9, 返回[0, 1]
 */
// [2, 7, 11, 15]

// [7, 2, -2, -6]

function twosum (nums, traget) {
  for (let i = 0; i < nums.length; i++) {
    let j = i
    for (j; j < nums.length; j++) {
      if (nums[i] + nums[j] === traget) {
        return [i, j]
      }
    }
  }
  return []
}

function twosum1 (nums, traget) {
  let obj = {}
  for (let i = 0; i < nums.length; i++) {
    let a = traget - nums[i]
    obj[a] = i // 7 对应 2的下标
    if (a === nums[obj[nums[i]]]) {
      console.log(obj)
      return [obj[nums[i]], i]
    }
  }
  return []
}

function twosum2 (nums, traget) {
  let obj = {}
  for (let i = 0; i < nums.length; i++) {
    let b = nums[i]
    if (obj[b] !== undefined) {
      return [obj[b], i]
    }
    let a = traget - b
    obj[a] = i
  }
  return []
}

console.log(twosum2([1, 2, 8, 9], 9))