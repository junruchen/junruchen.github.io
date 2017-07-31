import API from 'apis/routerList'
import moment from 'moment'

export default {
  clearSearchTag (ctx) {
    ctx.commit('setHasSearch', false)
    ctx.commit('setQueryParams', {
      key: 'searchContent',
      value: ''
    })
    ctx.dispatch('query', {})
  },
  query (ctx, parameters) {
    let params = {}
    let state = ctx.state
    if (parameters != null && parameters) {
      // 代表有参数的请求
      ctx.commit('setQueryParamsBatch', parameters)
      for (let k in state.queryParams) {
        if (state.queryParams[k] !== '') {
          params[k] = state.queryParams[k]
        }
      }
      if (state.queryParams.searchContent === '') {
        delete params.searchType
      }
    } else {
      ctx.commit('resetQueryParams')
      ctx.commit('setDateRange', [])
      ctx.commit('setSearchBack', {
        searchType: 1,
        searchCnt: ''
      })
      ctx.commit('setHasSearch', false)
    }
    ctx.commit('toggleLoading')
    params['page'] = state.currentPage
    API.query(params).then(response => {
      let data = response.data
      ctx.commit('toggleLoading')
      if (data.dutypersonlist) {
        ctx.commit('setDutyPersonMap', data.dutypersonlist)
      }
      if (data.result && data.result.model && data.result.model.length > 0) {
        let result = data.result
        let demandList = result.model
        ctx.commit('setDemandList', demandList)
        ctx.commit('setPages', {
          totalPage: result.totalPage
          // currentPage: parameters ? state.currentPage : 1
        })
      } else {
        ctx.commit('setDemandList', [])
        ctx.commit('setPages', {
          currentPage: 1,
          totalPage: 0
        })
      }
      if (params.searchContent) {
        ctx.commit('setHasSearch', true)
        ctx.commit('setSearchBack', {
          searchType: params.searchType,
          searchCnt: params.searchContent
        })
      } else {
        ctx.commit('setHasSearch', false)
        ctx.commit('setSearchBack', {
          searchType: state.queryParams.searchType,
          searchCnt: ''
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  queryDetail (ctx) {
    let state = ctx.state
    API.queryDetail(state.queryDetailParams).then(response => {
      let data = response.data
      // 卖家信息
      ctx.commit('setDialogDetailBatch', {
        sellerDetail: {
          sellerCompanyName: data.sellerCompanyName,
          sellerPhone: data.sellerPhone
        }
      })
      if (data && data.memberId) {
        ctx.commit('setDialogDetailBatch', {
          buyerDetail: {
            companyName: data.companyName,
            name: data.name,
            isAuth: data.isAuth,
            isTp: data.isTp,
            mobile: data.mobile,
            memberId: data.memberId,
            loginName: data.loginName
          },
          sellerDetail: {
            sellerPhone: data.sellerPhone,
            sellerCompanyName: data.sellerCompanyName
          }
        })
        ctx.commit('setInline', true)
      } else {
        ctx.commit('setInline', false)
      }
      ctx.commit('setCount', data.count)
    }).catch(err => {
      console.log(err)
    })
  },
  queryProcessRecord ({ state, commit }) {
    API.queryProcessRecord(state.queryProcessRecordParams).then(response => {
      let data = response.data
      let processRecord = []
      if (data && data.hasOwnProperty('record')) {
        let record = data.record
        if (record && record.hasOwnProperty('model') && record.model !== null && record.model.length > 0) {
          let list = record.model
          let len = list.length
          for (let i = len - 1; i >= 0; i--) {
            let principal = list[i].name
            let describe = list[i].content
            let contactDate = moment(list[i].gmtCreate).format('YYYY-MM-DD HH:mm:ss')
            // contactDate = list[i].gmtCreate
            processRecord.push({
              contactDate: contactDate,
              principal: principal,
              describe: describe
            })
          }
        }
      }
      commit('setProcessRecord', processRecord)
    }).catch(err => {
      console.log(err)
    })
  },
  updateProcessRecord ({ state }) {
    return new Promise((resolve, reject) => {
      // 暂时更改了api，防止更改数据
      API.updateProcessRecord(state.updateProcessRecordParams).then(response => {
        // 提交之后再请求一次跟进记录
        let data = response.data
        // 返回true代表更新成功
        if (data) {
          resolve()
        } else {
          reject('跟进记录更新失败，请刷新后重试')
        }
      }).catch(err => {
        console.log(err)
        reject('无权进行此操作')
      })
    })
  },
  updateDemand ({ commit, state }, status) {
    return new Promise((resolve, reject) => {
      if (status !== -1) {
        commit('setUpdateDemandParams', {
          key: 'status',
          value: status
        })
      }
      API.updateDemand(state.updateDemandParams).then(response => {
        let data = response.data
        if (data) {
          resolve()
        } else {
          reject('保存失败，请刷新后重试')
        }
      }).catch(() => {
        reject('无权进行此操作')
      })
    })
  },
  updateDemandBatch ({ state, dispatch }) {
    API.updateDemandBatch(state.multipleSelection).then(response => {
      let data = response.data
      if (data.hasOwnProperty('status') && data.status === 'true') {
        dispatch('query', {})
      } else {
        console.log('批量设置异常')
      }
    }).catch(err => {
      console.log(err)
    })
  },
  removeDemand ({ state }) {
    return new Promise((resolve, reject) => {
      API.removeDemand(state.queryProcessRecordParams).then(response => {
        if (response.data) {
          resolve()
        } else {
          reject()
        }
      }).catch(err => {
        console.log(err)
        reject()
      })
    })
  }
}
