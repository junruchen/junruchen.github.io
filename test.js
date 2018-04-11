function md5 (x) {
  return x
}
function f (n, x) {
  let result = x
  for (let i = 0; i < n; i++) {
    result = md5(result)
  }
  return result
}

function g (n, x) {
  if (n === 0) return x
  return f(g(n-1, x)%1024, x)
}


