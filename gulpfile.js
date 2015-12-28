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
    gulp.watch('src/sass/**/*.scss', ['styles']);
    gulp.watch('src/index.html', ['html']);
    gulp.watch('index.html').on('change', browserSync.reload);
    gulp.watch('src/img/**/*.*', ['assets']);
    gulp.watch('src/js/**/*.js', ['lint', 'scripts']);

    browserSync.init({
        server: './'
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
    gulp.src('src/sass/**/*.scss')
      .pipe(sass({
          outputStyle: 'compressed'
      }).on('error', sass.logError))
      .pipe(autoprefixer({
          browsers: ['last 2 versions']
      }))
      .pipe(gulp.dest('./css'))
      .pipe(browserSync.stream());
});

gulp.task('html', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('./'));
});

gulp.task('scripts', function() {
    gulp.src('src/js/**/*.js')
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./js'))
      .pipe(browserSync.stream());
});

gulp.task('scripts-dist', function() {
    gulp.src('src/js/**/*.js')
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./js'));
});

gulp.task('lint', function() {
    gulp.src('srcjs/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError())
      .pipe(gulp.dest('./js'))
      .pipe(browserSync.stream());
});

gulp.task('assets', function() {
    gulp.src('src/img/**/*.*')
      .pipe(imagemin({
          progressive: true
      }))
      .pipe(gulp.dest('./img'));
});
