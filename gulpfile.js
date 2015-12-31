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
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('default', ['styles', 'assets', 'html', 'lint', 'scripts'], function() {
    gulp.watch('src/sass/**/*.scss', ['styles']);
    gulp.watch('src/index.html', ['html']);
    gulp.watch('src/img/**/*.*', ['assets']);
    gulp.watch('src/js/**/*.js', ['lint', 'scripts']);
    gulp.watch('index.html').on('change', browserSync.reload);

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
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
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

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
    realFavicon.generateFavicon({
    masterPicture: 'img/logo.png',
    dest: 'favicons/',
    iconsPath: 'favicons/',
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: '#ffffff',
				margin: '28%',
				appName: 'HTML and CSS'
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'whiteSilhouette',
				backgroundColor: '#603cba',
				onConflict: 'override',
				appName: 'HTML and CSS'
			},
			androidChrome: {
				pictureAspect: 'backgroundAndMargin',
				margin: '17%',
				backgroundColor: '#ffffff',
				themeColor: '#9c27b0',
				manifest: {
					name: 'HTML and CSS',
					display: 'browser',
					orientation: 'notSet',
					onConflict: 'override'
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#9c27b0'
			}
		},
		settings: {
			compression: 1,
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
	gulp.src([ 'src/index.html' ])
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest('./'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
	});
});
