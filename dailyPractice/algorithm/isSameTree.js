/**
 * 给定两个二叉树，写一个函数来检查它们是否相同。
 * 如果两棵树在结构上相同并且节点具有相同的值，则认为它们是相同的。
 */

const tree = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 3,
      right: {
        val: 4
      }
    }
  },
  right: {
    val: 5
  }
}

var isSameTree = function (p, q) {
  if (q === p) return true

  if (q && p && p.val === q.val) {
    return isSameTree(q.left, p.left) && isSameTree(q.right, p.right)
  }

  return false
}

console.log(isSameTree({
  val: 1,
  left: {
    val: 2
  }
}, {
  val: 1,
  right: {
    val: 2
  }
}))