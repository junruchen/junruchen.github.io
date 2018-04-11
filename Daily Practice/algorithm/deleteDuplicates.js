/**
 * 删除排序链表中的重复元素
 * 给定1->1->2，返回 1->2
 * 给定 1->1->2->3->3，返回 1->2->3
 *
 * function ListNode(val) {
 *   this.val = val;
 *   this.next = null;
 * }
 * */
var node = {
  val: 0,
  next: {
    val: 0,
    next: {
      val: 1,
      next: {
        val: 1
      }
    }
  }
}

function deleteDuplicates1 (node) {
  let treeObj = {}

  function getTree (obj, pObj) {
    if (!treeObj[obj.val]) {
      treeObj[obj.val] = true
      if (obj.next) {
        getTree(obj.next, obj)
      }
    } else {
      if (pObj) {
        pObj.next = obj.next
        if (pObj.next) {
          getTree(pObj.next, pObj)
        }
      }
    }
  }

  if (node && node.next) {
    getTree(node)
  }

  return node
}

var deleteDuplicates2 = function (head) {
  if (head == null) return head
  let res = head
  while (head && head.next) {
    if (head.val === head.next.val) {
      head.next = head.next.next
    } else {
      head = head.next
    }
  }
  return res
}

console.log(JSON.stringify(deleteDuplicates2(node)))