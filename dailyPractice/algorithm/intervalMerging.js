/**
 * 区间合并，给定几个区间数组，返回长度区间
 * 如：[[1, 4], [4, 6], [9, 12]] => [[1, 6], [9, 12]]
 * */
function getConcatValue (list) {
  list.sort((a, b) => a[0] - b[0])
  const arr = [list[0]]
  for (let i = 1; i < list.length; i++) {
    const [x, y] = arr[arr.length - 1]
    const [a, b] = list[i]
    if (a > y) {
      arr.push([a, b])
    } else if (b > y) {
      arr[arr.length - 1] = [x, b]
    }
  }
  return arr
}

// var res = [[1, 4], [5, 6], [9, 12]]
console.log(getConcatValue2([
  [1, 4],
  [2, 3],
  [5, 6],
  [9, 12]
]))

// var res = [ [ 1, 6 ], [ 9, 12 ] ]
console.log(getConcatValue([
  [1, 4],
  [2, 6],
  [9, 12]
]))

// var res = [[ 1, 12 ]]
console.log(getConcatValue([
  [2, 6],
  [5, 12],
  [1, 4]
]))