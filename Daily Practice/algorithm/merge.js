/**
 * 合并有序数组
 *
 * 给定两个有序整数数组 nums1 和 nums2，将 nums2 合并到 nums1中，使得 num1 成为一个有序数组。
 * */
function merge (nums1, m, nums2, n) {
  let newArr = []
  let lastIdx = 0
  for (let i = 0; i < m; i++) {
    for (let j = lastIdx; j < n; j++) {
      if (nums1[i] < nums2[j]) {
        lastIdx = j
        newArr.push(nums1[i])
        if (lastIdx === n - 1 && i === m - 1) {
          newArr.push(nums2[j])
        }
        break
      } else {
        lastIdx = j
        newArr.push(nums2[j])
        if (lastIdx === n - 1) {
          newArr.push(nums1[i])
        }
      }
    }
  }
  return newArr
}

function merge2 (nums1, m, nums2, n) {
  for (let i = 0; i < n; i++) {
    nums1[m + i] = nums2[i]
  }
  let newArr = [nums1[0]]
  for (let i = 1; i < m + n; i++) {
    let key = nums1[i]
    let j = i - 1
    while (j >= 0 && newArr[j] >= key) {
      newArr[j + 1] = newArr[j]
      j--
    }
    newArr[j + 1] = key
  }
  return newArr
}

function merge3 (nums1, m, nums2, n) {
  for (let i = 0; i < n; i++) {
    let key = nums2[i]
    let j = m + i - 1
    while (j >= 0 && nums1[j] >= key) {
      nums1[j + 1] = nums1[j]
      j--
    }
    nums1[j + 1] = key
  }
}

function merge4 (nums1, m, nums2, n) {
  var res = []
  var i = 0, j = 0
  while (i < m && j < n) {
    if (nums1[i] > nums2[j]) {
      res.push(nums2[j])
      j++
    } else {
      res.push(nums1[i])
      i++
    }
  }
  while (i < m) {
    res.push(nums1[i])
    i++
  }
  while (j < n) {
    res.push(nums2[j])
    j++
  }
  return res
}

function merge5 (nums1, m, nums2, n) {
  var l = m + n - 1
  var i = m - 1
  var j = n - 1
  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      nums1[l] = nums1[i]
      i--
    } else {
      nums1[l] = nums2[j]
      j--
    }
    l--
  }
  while (j >= 0) {
    nums1[l--] = nums2[j--]
  }
  console.log(nums1)
}

merge5([4, 5, 7, 8, 9, 10], 6, [2, 3, 4, 9], 4)