var gulp = require('gulp');
var install = require("gulp-install");
var merge = require('merge-stream');
var concat = require('gulp-concat')
var minCss = require('gulp-minify-css')
var uglify = require('gulp-uglify')

/**
 * Install project libraries with bower.
 */
gulp.task('install_libs', function () {
  return gulp.src(['./bower.json'])
   .pipe(install());
});

/**
 * All js css paths in the project.
 */
var paths = {
  css_common: [
    './libs/bootstrap/dist/css/bootstrap.css',
  ],
  script_common: [
    './libs/jquery/dist/jquery.js',
  ],
  css_options: [
    './libs/chosen/chosen.min.css',
    './src/css/options.css',
  ],
  script_options: [
    './libs/chosen/chosen.jquery.min.js',
    './src/js/filter_array.js',
    './src/js/options.js',
  ],
  script_event_page: [
    './src/js/eventPage.js',
  ],
  img:[
    './libs/chosen/chosen-sprite.png',
    './libs/chosen/chosen-sprite@2x.png'
  ]
};

/**
 * Concatenate css files.
 *
 * @param gulpstream stream
 *   Gulp stream.
 * @param string output_name
 *   Output name for css file.
 *   
 * @returns gulpstream
 */
function concatCss(stream, output_name) {
  return stream
    .pipe(concat(output_name + '.css'))
    .pipe(gulp.dest('ext/css/'));
}

/**
 * Concatenate js files.
 *
 * @param gulpstream stream
 *   Gulp stream.
 * @param string output_name
 *   Output name for js file.
 *   
 * @returns gulpstream
 */
function concatJs(stream, output_name) {
  return stream
    .pipe(concat(output_name + '.js'))
    .pipe(gulp.dest('ext/js/'));
}

/**
 * Concatenate CSS.
 */
gulp.task('concatCss', function() {
  var options = concatCss(gulp.src(paths.css_options), 'options');
  var common  = concatCss(gulp.src(paths.css_common), 'common');
  
  return merge(common, options);
});

/**
 * Minify CSS.
 */
gulp.task('minCss', ['concatCss'], function() {
  return gulp.src('ext/css/*.css')
    .pipe(minCss({
        compatibility: 'ie8',
        keepSpecialComments: 0,
      }))
    .pipe(gulp.dest('ext/css/'))
});

/**
 * Concatenate JS.
 */
gulp.task('concatJs', function() {
  var options = concatJs(gulp.src(paths.script_options), 'options');
  var common = concatJs(gulp.src(paths.script_common), 'common');
  var event_page = concatJs(gulp.src(paths.script_event_page), 'eventPage');
  
  return merge(common, options, event_page);
});

/**
 * Minify JS.
 */
gulp.task('minJs', ['concatJs'], function() {
  return gulp.src('ext/js/*.js')
//    .pipe(uglify())
    .pipe(gulp.dest('ext/js/'))
});

/**
 * Replace chosen resources to ext folder.
 */
gulp.task("chosen_resources", function() {
  return gulp.src(paths.img)
    .pipe(gulp.dest('ext/css'))
});

/**
 * Watch all css/js
 */
gulp.task("watch", function() {
  gulp.watch("./src/css/*.css", ['minCss']);
  gulp.watch("./src/js/*.js", ['minJs']);
});

gulp.task('default', [ 'install_libs', 'minCss', 'minJs', 'chosen_resources' ]);
