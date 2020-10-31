const gulp = require('gulp')
const gutil = require('gulp-util')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { merge } = require('event-stream')
const map = require('map-stream')
const { spawn } = require('child_process')
const uglify = require('gulp-uglify-es').default
const clean = require('gulp-clean')
const plumber = require('gulp-plumber')
const autoprefixer = require('gulp-autoprefixer')
const less = require('gulp-less')
const replace = require('gulp-replace')
const preprocess = require('gulp-preprocess')
const wrap = require('gulp-wrap')
const concat = require('gulp-concat')
const zip = require('gulp-zip')
const cssmin = require('gulp-cssmin')

gulp.task('clean', async () =>
  gulp.src('./tmp', { allowEmpty: true }).pipe(clean())
)

gulp.task('css', () =>
  pipe(
    './src/styles/octotree.less',
    plumber(),
    less({ relativeUrls: true }),
    autoprefixer({ cascade: true }),
    './tmp'
  )
)

gulp.task('lib:ondemand', (cb) => {
  const dir = './libs/ondemand'
  const code = fs
    .readdirSync(dir)
    .map(
      (file) => `window['${file}'] = function () {
      ${fs.readFileSync(path.join(dir, file))}
    };\n`
    )
    .join('')

  fs.writeFileSync('./tmp/ondemand.js', code, { flag: 'w' })
  cb()
})

// WebExtensions
gulp.task('wex:template', () => buildTemplate())
gulp.task(
  'wex:js:ext',
  gulp.series(['wex:template', 'lib:ondemand'], () => buildJs())
)

gulp.task(
  'wex:js',
  gulp.series(['wex:js:ext'], () => {
    const src = [
      './libs/file-icons.js',
      './libs/jquery.js',
      './libs/jquery-ui.js',
      './libs/jstree.js',
      './libs/keymaster.js',
      './tmp/ondemand.js',
      './tmp/octotree.js',
    ]
    return pipe(
      src,
      wrap('(function(){\n<%= contents %>\n})();'),
      concat('content.js'),
      gutil.env.production && uglify(),
      './tmp'
    )
  })
)

gulp.task('wex', gulp.series(['wex:js']))

// Firefox
gulp.task('firefox:css:libs', async () =>
  buildCssLibs('.', 'moz-extension://__MSG_@@extension_id__/')
)
gulp.task(
  'firefox:css',
  gulp.series(['firefox:css:libs'], async () => buildCss())
)
gulp.task(
  'firefox',
  gulp.series(['firefox:css'], async () => prepareWexFolder('firefox'))
)

gulp.task('firefox:zip', async () =>
  pipe('./tmp/firefox/**/*', zip('firefox.zip'), './dist')
)

// Chrome
gulp.task('chrome:css:libs', async () =>
  buildCssLibs('.', 'chrome-extension://__MSG_@@extension_id__/')
)
gulp.task(
  'chrome:css',
  gulp.series(['chrome:css:libs'], async () => buildCss())
)
gulp.task(
  'chrome',
  gulp.series(['chrome:css'], async () => prepareWexFolder('chrome'))
)

gulp.task('chrome:zip', async () =>
  pipe('./tmp/chrome/**/*', zip('chrome.zip'), './dist')
)

// Opera
gulp.task(
  'opera',
  gulp.series(['chrome'], async () => pipe('./tmp/chrome/**/*', './tmp/opera'))
)

gulp.task('opera:nex', async () =>
  pipe('./tmp/opera/**/*', zip('opera.nex'), './dist')
)

// Helpers
function pipe(src, ...transforms) {
  const work = transforms
    .filter((t) => !!t)
    .reduce((stream, transform) => {
      const isDest = typeof transform === 'string'
      return stream
        .pipe(isDest ? gulp.dest(transform) : transform)
        .on('error', (err) => {
          gutil.log(gutil.colors.red('[Error]'), err.toString())
        })
    }, gulp.src(src))

  return work
}

function html2js(template) {
  return map(escape)

  function escape(file, cb) {
    const path = gutil.replaceExtension(file.path, '.js')
    const content = file.contents.toString()
    /* eslint-disable quotes */
    const escaped = content
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r?\n/g, "\\n' +\n    '")
    /* eslint-enable */
    const body = template.replace('$$', escaped)

    file.path = path
    file.contents = Buffer.from(body)
    cb(null, file)
  }
}

function buildJs(prefix = '.', ctx = {}) {
  const src = [
    `${prefix}/tmp/template.js`,
    `${prefix}/src/util.module.js`,
    `${prefix}/src/util.async.js`,
    `${prefix}/src/util.misc.js`,
    `${prefix}/src/util.dexss.js`,
    `${prefix}/src/util.plugins.js`,
    `${prefix}/src/core.constants.js`,
    `${prefix}/src/core.storage.js`,
    `${prefix}/src/core.plugins.js`,
    `${prefix}/src/core.api.js`,
    `${prefix}/src/adapters/adapter.js`,
    `${prefix}/src/adapters/pjax.js`,
    `${prefix}/src/adapters/github.js`,
    `${prefix}/src/view.help.js`,
    `${prefix}/src/view.error.js`,
    `${prefix}/src/view.tree.js`,
    `${prefix}/src/view.options.js`,
    `${prefix}/src/main.js`,
  ]

  return pipe(src, preprocess({ context: ctx }), concat('octotree.js'), './tmp')
}

function buildCssLibs(prefix = '.', targetPrefix = '') {
  return merge(
    pipe(
      `${prefix}/libs/file-icons.css`,
      replace('../fonts', `${targetPrefix}fonts`),
      './tmp'
    ),
    pipe(
      `${prefix}/libs/jstree.css`,
      replace('url("32px.png")', `url("${targetPrefix}images/32px.png")`),
      replace('url("40px.png")', `url("${targetPrefix}images/40px.png")`),
      replace(
        'url("throbber.gif")',
        `url("${targetPrefix}images/throbber.gif")`
      ),
      './tmp'
    )
  )
}

function buildCss(prefix = '.') {
  return pipe(
    [
      `${prefix}/tmp/file-icons.css`,
      `${prefix}/tmp/jstree.css`,
      `${prefix}/tmp/octotree.css`,
    ],
    concat('content.css'),
    gutil.env.production && cssmin(),
    './tmp'
  )
}

function buildTemplate(prefix = '.', ctx = {}) {
  const LOTS_OF_SPACES = new Array(500).join(' ')

  return pipe(
    `${prefix}/src/template.html`,
    preprocess({ context: ctx }),
    replace('__SPACES__', LOTS_OF_SPACES),
    html2js("const TEMPLATE = '$$'"),
    './tmp'
  )
}

function prepareWexFolder(browser) {
  return merge(
    pipe('./icons/**/*', `./tmp/${browser}/icons`),
    pipe('./libs/fonts/**/*', `./tmp/${browser}/fonts`),
    pipe('./libs/images/**/*', `./tmp/${browser}/images`),
    pipe('./tmp/content.*', `./tmp/${browser}`),
    pipe(
      './src/config/wex/manifest.json',
      preprocess({ context: { browser } }),
      replace('$VERSION', getVersion()),
      `./tmp/${browser}`
    ),
    pipe(
      './src/config/wex/background.js',
      preprocess({ context: { browser } }),
      gutil.env.production && uglify(),
      `./tmp/${browser}`
    )
  )
}

function getVersion() {
  delete require.cache[require.resolve('./package.json')]
  return require('./package.json').version
}

gulp.task(
  'build',
  gulp.series(['clean', 'css', 'wex', 'chrome', 'opera', 'firefox'])
)

gulp.task(
  'dist',
  gulp.series(['build', 'chrome:zip', 'opera:nex', 'firefox:zip'])
)

gulp.task('default', gulp.series(['build']))

module.exports = {
  pipe,
  buildTemplate,
  buildJs,
  buildCssLibs,
  buildCss,
}
