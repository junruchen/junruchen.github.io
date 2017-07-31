import {
  query,
  queryReason,
  saveReason
} from 'apis/router'

export default {
  query ({ commit }, id) {
    query(id).then((res) => {
      commit('setModel', res.data)
    })
  },
  queryReason ({commit, state}, params) {
    return new Promise((resolve, reject) => {
      queryReason(params).then(response => {
        resolve(response.data)
      }).catch(err => {
        console.log(err)
      })
    })
  },
  saveReason ({commit, state}, params) {
    return new Promise((resolve, reject) => {
      saveReason(params).then(response => {
        let data = response.data
        if (data.result === 1) {
          resolve(response.data)
        } else if (data.result === 0) {
          reject()
        }
      }).catch(err => {
        console.log(err)
      })
    })
  }
}
