// macrotask
setTimeout(() => {
  console.log('b')
}, 0)

setTimeout(() => {
  console.log('c')
}, 0)

//  microtask
new Promise((resolve) => {
  console.log('d')
  resolve()
}).then(() => {
  console.log('e')
})

new Promise((resolve) => {
  console.log('f')
  resolve()
}).then(() => {
  console.log('g')
})

process.nextTick(() => {
  console.log('h')
})

console.log('a')