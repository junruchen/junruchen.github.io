import {
  querySeller,
  queryList,
  queryQuatation,
  closeQuotation,
  updateQuatation
} from 'apis/quotation'

export default {
  /**
   * 查询卖家手机号是否存在
   */
  querySeller ({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      querySeller({
        demandId: state.demandId,
        mobile: params.mobile
      }).then(response => {
        let data = response.data
        if (parseInt(data.result) === 1) {
          resolve()
        } else {
          reject(data.result)
        }
      }).catch(() => {
        reject()
      })
    })
  },

  /**
   * 1.首次加载时，请求邀请的卖家列表，需要传入params.demandId
   * 2.进行其他操作(如保存)之后重新请求列表时，不需要传入params参数
   */
  queryList ({ commit, state }, params) {
    commit('setLoading', true)
    commit('reset')
    if (params && params.demandId) {
      commit('setDemandId', params.demandId)
    }
    queryList({
      demandId: state.demandId
    }).then(response => {
      let data = response.data
      commit('setQuotationStatus', data)
      commit('setLoading', false)
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 点击'全部报价'，请求某个卖家的报价列表
   */
  queryQuatation ({ commit, state }, { params }) {
    return new Promise((resolve, reject) => {
      commit('setLoading', true)
      // 设置demandMatchingId
      if (params && params.hrdDemandMatchingId) {
        commit('setHrdDemandMatchingId', params.hrdDemandMatchingId)
      }
      queryQuatation({
        demandId: state.demandId,
        hrdDemandMatchingId: state.hrdDemandMatchingId
      }).then(response => {
        let data = response.data
        data.isServer = true
        commit('setCompanyQuotationDialog', data)
        commit('setQuoteRequirement', data)
        commit('setLoading', false)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  /**
   * 点击弹窗中的'保存'，更新某卖家的报价列表
   */
  updateQuatation ({ commit, state }, { quatationList }) {
    return new Promise((resolve, reject) => {
      updateQuatation({
        submitParam: JSON.stringify({
          hrdQuotations: quatationList,
          hrdDemandMatching: {
            id: state.hrdDemandMatchingId
          },
          hrdQuotationAggregate: {
            id: state.aggId,
            'demandId': state.demandId,
            'discountPrice': state.discountPrice,
            'freight': state.freight,
            'hrdDemandMatchingId': state.hrdDemandMatchingId
          }
        })
      }).then(response => {
        if (parseInt(response.data.result) === 1) {
          resolve()
        } else {
          reject()
        }
      }).catch(err => {
        console.log(err)
        reject()
      })
    })
  },

  /**
   * 截止报价
   */
  closeQuotation ({ commit, state }) {
    return new Promise((resolve, reject) => {
      closeQuotation({
        demandId: state.demandId
      }).then(response => {
        if (response) {
          resolve()
        } else {
          reject()
        }
      }).catch(() => {
        reject()
      })
    })
  }
}
