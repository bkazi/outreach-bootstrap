// see licence.txt
/*eslint-env node*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');

gulp.task('default', ['styles', 'html', 'assets', 'lint', 'scripts'], function() {
  gulp.watch('sass/**/*.scss', ['styles']);
  gulp.watch('index.html', ['html']);
  gulp.watch('./build/index.html').on('change', browserSync.reload);
  gulp.watch('img/**/*.*', ['assets']);
  gulp.watch('js/**/*.js', ['lint', 'scripts']);

  browserSync.init({
      server: './build/'
  });
});

gulp.task('serve',
  [ 'styles',
    'html',
    'assets',
    'lint',
    'scripts-dist'
  ]);

gulp.task('styles', function() {
  gulp.src('sass/**/*.scss')
      .pipe(sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions']
      }))
      .pipe(gulp.dest('./build/css'))
      .pipe(browserSync.stream());
});

gulp.task('html', function() {
  gulp.src('index.html')
      .pipe(gulp.dest('./build'))
});

gulp.task('scripts', function() {
  gulp.src('js/**/*.js')
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./build/js'));
});

gulp.task('scripts-dist', function() {
  gulp.src('js/**/*.js')
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./build/js'));
});

gulp.task('lint', function() {
  gulp.src('js/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError())
      .pipe(gulp.dest('./build/js'))
      .pipe(browserSync.stream());
});

gulp.task('assets', function() {
  gulp.src('img/**/*.*')
      .pipe(imagemin({
        progressive: true
      }))
      .pipe(gulp.dest('./build/img'));
});
