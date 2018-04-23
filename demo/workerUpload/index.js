/**
 * 借助worker
 */
const w = new Worker('/worker.js')
function upload () {
  let file = document.getElementById('uploadFile').files[0]
  w.postMessage(file)
  w.onmessage = (e) => {
    console.log('-----上传成功-----, 操作', e.data)
  }
}