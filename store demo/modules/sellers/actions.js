import {
  querySeller,
  queryList,
  queryAreas,
  inviteBatch
} from 'apis/sellers.js'
export default {
  /**
   * [setInviteList 设置邀请列表]
   * @param {[type]} commit     [description]
   * @param {[type]} state      [description]
   * @param {[type]} sellerItem [description]
   * @param {[type]} seller     [description]
   */
  setInviteList ({
    commit,
    state
  }, {
    sellerItem,
    seller
  }) {
    /* 将卖家添加到邀请列表中 */
    state.inviteList.push(sellerItem)
    /* 修改卖家在卖家列表里的状态 */
    commit('setSellerListItemState', seller)
  },
  /**
   * [removeSellerFromInviteList 将卖家从邀请列表中删除]
   * @param  {[type]} commit [description]
   * @param  {[type]} state  [description]
   * @param  {[type]} seller [description]
   * @return {[type]}        [description]
   */
  removeSellerFromInviteList ({
    commit,
    state
  }, {
    seller
  }) {
    let memberId = seller.sellerMemberId || seller.memberId
    let deleteIndex = -1
    state.inviteList.find(function (ele, index) {
      if (ele.memberId === memberId) {
        deleteIndex = index
      }
    })
    if (deleteIndex !== -1) {
      /* 将卖家在邀请列表里删除 */
      state.inviteList.splice(deleteIndex, 1)
      /* 修改卖家在卖家列表里的状态 */
      commit('setSellerListItemState', seller)
    }
  },
  inviteBatch ({
    commit,
    state
  }) {
    let memberIds
    let memberIdList = []
    let accountIds
    let accountIdList = []
    state.inviteList.forEach(function (ele, index) {
      memberIdList.push(ele.memberId)
      accountIdList.push(ele.accountId)
    })
    memberIds = memberIdList.join(',')
    accountIds = accountIdList.join(',')

    return inviteBatch({
      demandId: state.demandId,
      memberIds: memberIds,
      accountIds: accountIds
    })
  },
  queryAreas ({
    commit,
    state
  }) {
    return queryAreas()
  },
  queryList ({
    commit,
    state
  }, {
    type
  }) {
    let params = {}
    if (type === 2) {
      for (var k in state.queryParams) {
        if (state.queryParams[k] !== '' && state.queryParams[k] !== '-1') {
          params[k] = state.queryParams[k]
        }
      }
      params['pageNo'] = state.currentPage - 1
    }
    params['demandId'] = state.demandId
    commit('setLoadingState', true)
    commit('setSellerListState', {})
    queryList(params).then(response => {
      let data = response.data
      commit('setSellerListState', data)
      commit('setLoadingState', false)
    }).catch(err => {
      throw new Error(err)
    })
  },
  querySeller ({
    commit,
    state
  }, {
    mobile
  }) {
    return querySeller({
      mobile: mobile,
      demandId: state.demandId
    })
  }
}
