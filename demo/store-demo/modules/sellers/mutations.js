import {
  tagMap
} from 'config/seller.config.js'
export default {
  /* 重置请求参数 */
  resetSellerQueryParams (state) {
    state.queryParams = {
      types: '',
      model: '',
      level: '',
      searchWord: '',
      area: '-1'
    }
  },
  /* 设置loading动画状态 */
  setLoadingState (state, status) {
    state.loading = status
  },
  /* 设置请求参数 */
  setQueryParams (state, data) {
    for (var k in data) {
      state.queryParams[k] = data[k]
    }
  },
  /* 设置卖家列表中每一项的状态(添加/取消添加) */
  setSellerListItemState (state, seller) {
    let memberId = seller.sellerMemberId || seller.memberId
    let sellerIndex = -1
    state.sellerList.find(function (ele, index) {
      return ele.sellerMemberId === memberId ? (sellerIndex = index) : ''
    })
    if (sellerIndex !== -1) {
      state.sellerList[sellerIndex].addFlag = !state.sellerList[sellerIndex].addFlag
    }
    /* 为了使vue检测到数组变化 */
    state.sellerList.splice(state.sellerList.length + 1, 0)
  },
  /* 清除邀请列表 */
  clearInviteList (state, memFailList) {
    if (memFailList) {
      if (!memFailList.length) {
        state.inviteList = []
      } else {
        let inviteList = []
        memFailList.forEach(function (memberId, index) {
          state.inviteList.find(function (iEle, index) {
            if (memberId === iEle.memberId) {
              inviteList.push(iEle)
            }
          })
        })
        state.inviteList = inviteList
      }
    }
  },
  /* 设置卖家列表的状态(在请求卖家列表时调用，遍历列表，判断每个卖家的操作状态是 添加/取消添加 */
  setSellerListState (state, data) {
    state.sellerList = data.hrdDemandMatchingVo || []
    state.totalPage = data.totalPage || 0
    state.addedCount = data.addedCount || 0
    if (data.searchModelResult) {
      state.pageSize = data.searchModelResult.pageSize || 20
    }
    state.inviteList.forEach(function (inviteItem, index) {
      state.sellerList.forEach(function (sellerItem, index) {
        if (inviteItem.memberId === sellerItem.sellerMemberId) {
          sellerItem.addFlag = true
        }
      })
    })
  },
  /* 设置当前页 */
  setCurrentPage (state, page) {
    state.currentPage = page
  },
  setDemandId (state, id) {
    state.demandId = id
  },
  /* 设置筛选条件中的标签，每次调用前，需要清除queryParams中的相关标签，然后重新赋值 */
  setQueryTags (state, list) {
    for (var k in tagMap) {
      let key = tagMap[k]
      delete state.queryParams[key]
    }
    list.forEach(function (ele, index) {
      let name = ele
      if (tagMap[name]) {
        let key = tagMap[name]
        state.queryParams[key] = 1
      }
    })
  }
}
