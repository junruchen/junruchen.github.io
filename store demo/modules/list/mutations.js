import { resetDeep } from '../../../views/router/list/util.js'
export default {
  setReasonList (state, {list, type}) {
    if (type === 1) {
      state.cancelReasonList = list
    } else {
      state.deleteReasonList = list
    }
  },
  // 清空弹窗数据
  resetDialog (state, data) {
    // dialogDetail,processRecord,updateDemandParams
    state.processRecord = []
    for (var k in state.updateDemandParams) {
      state.updateDemandParams[k] = ''
    }
    resetDeep(state.dialogDetail)
  },
  // 批量设置query请求参数
  setQueryParamsBatch (state, data) {
    for (var k in data) {
      state.queryParams[k] = data[k]
    }
  },
  // 单独设置query参数的某个字段
  setQueryParams (state, data) {
    let key = data.key
    let value = data.value
    state.queryParams[key] = value
  },
  // 设置负责人map
  setDutyPersonMap (state, map) {
    state.dutyPersonMap = map
  },
  // 设置请求参数中的日期范围
  setDateRange (state, value) {
    state.dateRange = value || []
  },
  // 设置是否有搜索字段，用于控制动态标签中，搜索标签的显示
  setHasSearch (state, value) {
    state.hasSearch = value
  },
  // 设置搜索内容拷贝字段，防止出现 有 动态 搜索标签 时，修改搜索内容会导致标签变化的情况
  setSearchBack (state, data) {
    state.searchBack.searchType = data.searchType
    state.searchBack.searchCnt = data.searchCnt
  },
  // 设置需求列表，即table中的数据
  setDemandList (state, data) {
    state.demandList = data
  },
  // 多选时，设置选中的数据，element ui 自身的方法
  setMultiSelection (state, data) {
    state.multipleSelection = data
  },
  // 设置当前页面，总页面
  setPages (state, page) {
    state.currentPage = page.currentPage !== undefined ? page.currentPage : state.currentPage
    state.totalPage = page.totalPage !== undefined ? page.totalPage : state.totalPage
  },
  // 重置query请求的参数
  resetQueryParams (state) {
    for (var k in state.queryParams) {
      if (k === 'demandStatus' || k === 'dutyPerson' || k === 'source' || k === 'searchContent') {
        state.queryParams[k] = ''
      }
      if (k.indexOf('gmt') !== -1) {
        state.queryParams.gmtStart = ''
        state.queryParams.gmtEnd = ''
      }
    }
  },
  // 弹窗中点击保存，提交至待完善，删除等操作时，单独设置更新需求的参数
  setUpdateDemandParams (state, data) {
    let key = data.key
    let value = data.value
    state.updateDemandParams[key] = value
  },
  // 弹窗中点击保存，提交至待完善，删除等操作时，批量设置更新需求的参数
  setUpdateDemandParamsBatch (state, data) {
    for (var k in data) {
      state.updateDemandParams[k] = data[k]
    }
  },
  // 批量设置弹窗只需 显示 的数据，即不能修改的数据
  setDialogDetailBatch (state, data) {
    for (var k in data) {
      state.dialogDetail[k] = data[k]
    }
  },
  // 批量设置 打开弹窗后，单独发送的querydetail请求的参数
  setQueryDetailParamsBatch (state, data) {
    for (var k in data) {
      state.queryDetailParams[k] = data[k]
    }
  },
  // 批量设置 打开弹窗后，单独发送的queryrecord请求的参数
  setQueryProcessRecordParams (state, data) {
    let key = data.key
    let value = data.value
    state.queryProcessRecordParams[key] = value
  },
  // 得到跟进记录数据时，设置跟进记录
  setProcessRecord (state, data) {
    state.processRecord = data
  },
  // 设置弹窗中的参数，这个参数控制是否显示卖家信息，以及需求联系信息的显示方式（样式方面，设置三个输入框在一行显示还是换行显示）
  setInline (state, value) {
    state.inline = value
  },
  // 根据getdetail接口返回的数据，设置历史需求记录
  setCount (state, data) {
    state.dialogDetail.buyerDetail.count = data
  },
  // 提交新的跟进记录时，设置跟进记录的参数
  setUpdateProcessRecordParams (state, data) {
    let key = data.key
    let value = data.value
    state.updateProcessRecordParams[key] = value
  },
  // filteroperation组件中，批量设置需求状态或者负责人
  setDemandBatch (state, data) {
    let key = data.key
    let value = data.value
    state.multipleSelection.forEach(function (ele, index) {
      ele[key] = value
    })
  },
  // toggle loading 状态
  toggleLoading (state, data) {
    state.loading = !state.loading
  }
}
