var onmessage = function (e) {
  let reader = new FileReader()
  reader.readAsText(e.data)
  reader.onerror = () => {
    console.log(new Error('上传失败'))
  }
  reader.onload = (res) => {
    postMessage(res.target.result)
  }
}
