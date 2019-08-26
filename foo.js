function resolveToken (token) {
  if (token) {
    let base64Url = token.substring(7).split('.')[1]
    let base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(global.atob(base64))
  }
  console.log(token)
}

let token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0NjgiLCJleHAiOjE1NDUzODIzNTIsInJvbGVOYW1lIjoiUk9MRV9tYXN0ZXIifQ.B0dAnkQUpjqZvCuTjk5rFqsvmW1KMT56MEMEPcRPkUyRpFdsqZ6uhPUuA-LYKqbzLmM0MkgWuIT7sEuNx7XrOQ'
let base64Url = token.substring(7).split('.')[1]
let base64 = base64Url.replace('-', '+').replace('_', '/')
JSON.parse(window.atob(base64))

token = 'new'