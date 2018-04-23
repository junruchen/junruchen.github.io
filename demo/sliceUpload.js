/**
 * 分段上传处理
 */
function upload () {
  let file = document.getElementById('uploadFile').files[0]
  let step = 1024
  let total = file.size
  let curLoad = 0
  let reader = new FileReader()
  file.slice = file.slice || file.webkitSlice || file.mozSlice
  if (!file.slice) {
    const sliceRead = () => {
      let blob = file.slice(curLoad, curLoad + step)
      reader.readAsText(blob)
      this.uploadFile(reader).then((res) => {
        console.log('-----片段上传成功-----, 操作')
        curLoad = curLoad + res.loaded
        if (curLoad < total) {
          sliceRead()
          console.log('上传中', curLoad)
        } else {
          console.log('上传结束')
        }
      })
    }
    sliceRead()
  } else {
    console.log('------无法截取，直接上传-----')
    reader.readAsText(file)
    this.uploadFile(reader).then((res) => {
      console.log('-----上传成功-----, 操作')
    })
  }
}

function uploadFile (reader) {
  return new Promise(function (resolve, reject) {
    reader.onerror = () => {
      reject(new Error('上传失败'))
    }
    reader.onload = (res) => {
      resolve(res)
    }
  })
}