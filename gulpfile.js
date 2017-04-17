var gulp = require('gulp');
var install = require("gulp-install");
var concat = require('gulp-concat')
var minCss = require('gulp-minify-css')
var uglify = require('gulp-uglify')


// Css js paths.
var paths = {
  css:[
    './libs/bootstrap/dist/css/bootstrap.css',
    './libs/chosen/chosen.min.css',
    './src/css/*.css',
  ],
  script:[
    './libs/jquery/dist/jquery.js',
    './libs/chosen/chosen.jquery.min.js',
    './src/js/*.js',
  ],
  img:[
    './libs/chosen/chosen-sprite.png',
    './libs/chosen/chosen-sprite@2x.png'
  ]
};

gulp.task('install_libs', function () {
  return gulp.src(['./bower.json'])
   .pipe(install());
});

// Concat css.
gulp.task('concatCss', function() {
  return gulp.src(paths.css)
    .pipe(concat('options.css'))
    .pipe(gulp.dest('ext/css/'));
});

// Minify css.
gulp.task('minCss', ['concatCss'], function() {
  return gulp.src('ext/css/*.css')
    .pipe(minCss({
        compatibility: 'ie8',
        keepSpecialComments: 0,
      }))
    .pipe(gulp.dest('ext/css/'))
});

// Concat js.
gulp.task('concatJs', function() {
  return gulp.src(paths.script)
    .pipe(concat('options.js'))
    .pipe(gulp.dest('ext/js/'));
});

// Min js.
gulp.task('minJs', ['concatJs'], function() {
  return gulp.src('ext/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('ext/js/'))
});

gulp.task("chosen_resources", function() {
  return gulp.src(paths.img)
    .pipe(gulp.dest('ext/css'))
});

// Watch css and js.
gulp.task("watch", function() {
  gulp.watch(paths.css, ['minCss']);
  gulp.watch(paths.script, ['minJs']);
});

gulp.task('default', [ 'install_libs', 'minCss', 'minJs', 'chosen_resources']);
