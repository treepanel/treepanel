function parallel(arr, iter, done) {
  var total = arr.length
  if (total === 0) return done()

  arr.forEach(function(item) {
    iter(item, finish)
  })

  function finish() {
    if (--total === 0) done()
  }
}