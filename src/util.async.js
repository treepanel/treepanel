function parallel(arr, iter, done) {
  let total = arr.length
  if (total === 0) {
    return done()
  }

  arr.forEach((item) => {
    iter(item, finish)
  })

  function finish() {
    if (--total === 0) {
      done()
    }
  }
}
