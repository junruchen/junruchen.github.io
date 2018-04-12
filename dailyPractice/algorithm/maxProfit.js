/**
 * 假设你有一个数组，其中第 i 个元素是一支给定股票第 i 天的价格。
 * 如果您只能完成最多一笔交易（即买入和卖出一股股票），则设计一个算法来找到最大的利润。
 *
 * 输入: [7, 1, 5, 3, 6, 4]
 * 输出: 5
 * 最大利润 = 6-1 = 5（不是 7-1 = 6, 因为卖出价格需要大于买入价格）
 *
 * 输入: [7, 6, 4, 3, 1]
 * 输出: 0
 * 在这种情况下, 没有交易完成, 即最大利润为 0。
 */

function maxProfit2 (arr) {
  let max = 0
  let len = arr.length
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      max = (arr[j] - arr[i]) > max ? arr[j] - arr[i] : max
    }
  }
  return max
}

function maxProfit (arr) {
  let min = Number.MAX_VALUE
  let len = arr.length
  let max = 0
  for (let i = 0; i < len; i++) {
    var tmp = arr[i]
    if (tmp >= min) {
      max = Math.max(max, arr[i] - min)
    } else {
      min = tmp
    }
  }
  return max
}

// const arr = [7, 1, 5, 3, 6, 4]
const arr = [5, 5, 4, 2, 1]
console.log(maxProfit(arr))

