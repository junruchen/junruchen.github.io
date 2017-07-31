export default {
  setModel (state, model) {
    state.model = model
  },

  updateStatus (state, status) {
    state.model.hrdDetailModel.status = status
  },

  setCancelTips (state, status) {
    state.showCancelTips = status
  }
}
