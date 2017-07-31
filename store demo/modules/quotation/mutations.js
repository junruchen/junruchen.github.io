export default {
  /* 设置报价补充 */
  setQuotationContent (state, data) {
    state.content = data
  },
  /*
   更改弹窗中的报价列表的价格
   */
  setCompanyQuotationListPrice (state, data) {
    state.companyQuotationList[data.index].nowPrice = data.price
  },

  /*
   弹窗显示或隐藏，暂时没用，被DETAIL_QUOTATION_SET_DIALOG_STATE替代
   */
  toggleDialogVisible (state, data) {
    state.quotationDialogVisible = !state.quotationDialogVisible
  },

  /*
   没用，被DETAIL_QUOTATION_SET_DIALOG_STATE替代
   */
  setDialogType (state, data) {
    state.dialogType = data.type
  },

  /*
   设置弹窗状态，显示隐藏，类型，标题
   */
  setDialogState (state, data) {
    state.quotationDialogVisible = !state.quotationDialogVisible
    if (data) {
      if (data.type) {
        state.dialogType = data.type
      }
      if (data.title) {
        state.dialogTitle = data.title
      }
    }
  },

  setQuotationList (state, data) {
    state.quotationList = data
  },

  /*
   调用queryList接口之后，根据返回数据设置列表，需求状态，按钮是否禁用
   */
  setQuotationStatus (state, data) {
    if (data.hrdDemandMatchingVo && data.hrdDemandMatchingVo.length) {
      state.invited = 2
      state.quotationList = data.hrdDemandMatchingVo
    } else {
      state.invited = 1
    }
    if (data.inviteButton) {
      state.inviteButtonShow = true
    } else {
      state.inviteButtonShow = false
    }
    if (data.demandType) {
      state.demandType = data.demandType
    }
    if (data.hasOwnProperty('closeButton')) {
      state.closeButtonShow = data.closeButton
    }
    if (data.demandStatus) {
      state.demandStatus = data.demandStatus
    }
  },

  setDemandId (state, data) {
    state.demandId = data
  },

  setHrdDemandMatchingId (state, data) {
    state.hrdDemandMatchingId = data
  },

  /*
   设置 报价列表 弹窗中的字段值
   */
  setCompanyQuotationDialog (state, data) {
    if (data) {
      if (data.hrdQuotationVoList || data.isServer) {
        state.companyQuotationList = data.hrdQuotationVoList
      }
      if (data.hrdQuotationAggregate) {
        if (data.hrdQuotationAggregate.freight != null) {
          state.freight = data.hrdQuotationAggregate.freight
        }
        if (data.hrdQuotationAggregate.discountPrice != null) {
          state.discountPrice = data.hrdQuotationAggregate.discountPrice
        }
        if (data.hrdQuotationAggregate.id) {
          state.aggId = data.hrdQuotationAggregate.id
        }
        if (data.hrdQuotationAggregate.content) {
          state.content = data.hrdQuotationAggregate.content
        }
      } else if (data.isServer) {
        state.freight = ''
        state.discountPrice = ''
      }
    }
  },

  setQuoteRequirement (state, data) {
    state.quoteRequirement = data.quoteRequirement
  },

  /*
   重置数据
   */
  reset (state, data) {
    state.quotationList = []
    state.companyQuotationList = []
    state.freight = ''
    state.discountPrice = ''
    state.aggId = ''
    state.invited = '0'
    state.demandType = ''
    state.demandStatus = ''
    state.inviteButtonShow = false
    state.closeButtonShow = false
  },

  // 设置loading，true/false
  setLoading (state, data) {
    state.loading = data
  }
}
