/**
 * 检查字符串中的小括号是否正确
 * 假设字符串中只有小括号
 * > 检测左右的小括号个数是都相等
 * > 检测第一个以及最后一个
 * */
function checkParenthesis (str) {
  let lIdxs = getPostionIdx(str, '(')
  let lLen = lIdxs.length
  let rIdxs = getPostionIdx(str, ')')
  let rLen = rIdxs.length
  if (lLen !== rLen) return false
  if (lIdxs[0] < rIdxs[0] && lIdxs[lLen - 1] < rIdxs[rLen - 1]) {
    return true
  } else {
    return false
  }
}

function getPostionIdx (str, substr) {
  let idxArr = []
  let postionIdx = str.indexOf(substr)
  while (postionIdx > -1) {
    idxArr.push(postionIdx)
    postionIdx = str.indexOf(substr, postionIdx + 1)
  }
  return idxArr
}
// console.log(getPostionIdx('abs[(2v((2)f))]x', '('))
// console.log(checkParenthesis('abs[(2v((2)f))]x'))

/**
 * 检查字符串中的括号配对是否正确
 * 只包括 '('，')'，'{'，'}'，'['，']' 的字符串
 * > 排除长度为奇数的字符串
 * > (){}[]{}[]...
 * > ([]){}
 * > ({[]})
 * */
function checkBrackets (str) {
  let len = str.length
  if (len % 2 !== 0)
    return false
  let leftArr = []
  let BracketsMap = {
    '(': ')',
    '[': ']',
    '{': '}'
  }
  for (let i = 0; i < len; i++) {
    if (BracketsMap[str[i]]) {
      leftArr.push(str[i])
    } else {
      let lastKey = leftArr[leftArr.length - 1]
      if (str[i] === BracketsMap[lastKey]) {
        leftArr.splice(leftArr.length - 1, 1)
      } else {
        return false
      }
    }
  }
  if (leftArr.length === 0) {
    return true
  } else {
    return false
  }
}

function goodCheckBrackets (str) {
  let len = str.length
  if (len % 2 !== 0)
    return false
  let leftArr = []
  for (let i = 0; i < len; i++) {
    if (str[i] === '(') {
      leftArr.push(')')
    } else if (str[i] === '[') {
      leftArr.push(']')
    } else if (str[i] === '{') {
      leftArr.push('}')
    } else if (leftArr.length === 0 || leftArr.pop() !== str[i]) {
      return false
    }
  }
  if (leftArr.length === 0) {
    return true
  } else {
    return false
  }
}
const str = '{({})[]'
console.log(goodCheckBrackets(str))