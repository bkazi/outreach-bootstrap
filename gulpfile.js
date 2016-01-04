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
var ghPages = require('gulp-gh-pages');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var critical = require('critical');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('default', function() {
    runSequence('styles', 'assets', 'html', 'lint', 'scripts');
    gulp.watch('src/sass/**/*.scss', ['styles']);
    gulp.watch('src/index.html', ['html']);
    gulp.watch('src/img/**/*.*', ['assets']);
    gulp.watch('src/js/**/*.js', ['lint', 'scripts']);
    gulp.watch('index.html').on('change', browserSync.reload);

    browserSync.init({
        server: './'
    });
});

gulp.task('build', ['dist'], function() {
    critical.generate({
        inline: true,
        base: '../',
        src: 'index.html',
        dest: 'index.html',
        minify: true,
        dimensions: [{
            height: 200,
            width: 500
        }, {
            height: 760,
            width: 400
        }, {
            height: 1024,
            width: 768
        }, {
            height: 768,
            width: 1366
        }]
    });
});

gulp.task('dist', function() {
    runSequence('assets-dist',
                'check-for-favicon-update',
                'styles-dist',
                'html-dist',
                'scripts-dist');
});

gulp.task('deploy', function() {
    return gulp.src('./**/*')
        .pipe(ghPages());
});

gulp.task('styles-dist', function() {
    gulp.src('src/sass/**/*.scss')
      .pipe(sass({
          outputStyle: 'compressed'
      }).on('error', sass.logError))
      .pipe(autoprefixer({
          browsers: ['last 2 versions']
      }))
      .pipe(gulp.dest('./css'));
});

gulp.task('styles', function() {
    gulp.src('src/sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
          browsers: ['last 2 versions']
      }))
      .pipe(gulp.dest('./css'))
      .pipe(browserSync.stream());
});

gulp.task('html-dist', function() {
    gulp.src('src/index.html')
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(htmlmin({collapseWhiteSpace: true}))
        .pipe(gulp.dest('./'));
});

gulp.task('html', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('./'));
});

gulp.task('scripts', function() {
    gulp.src(['src/js/**/*.min.js','src/js/**/*.js'])
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./js'))
      .pipe(browserSync.stream());
});

gulp.task('scripts-dist', function() {
    gulp.src(['src/js/**/*.min.js','src/js/**/*.js'])
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./js'));
});

gulp.task('lint', function() {
    gulp.src('srcjs/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
});

gulp.task('assets-dist', function() {
    gulp.src('src/img/**/*.*')
      .pipe(imagemin({
          progressive: true
      }))
      .pipe(gulp.dest('./img'));
});

gulp.task('assets', function() {
    gulp.src('src/img/**/*.*')
      .pipe(gulp.dest('./img'));
});

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

gulp.task('inject-favicon-markups', function() {
    gulp.src([ 'src/index.html' ])
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest('./'));
});

// Include in production task to generate new icons if fails check
// Also useful in CI
gulp.task('check-for-favicon-update', function() {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function(err) {
        if (err) {
            runSequence('generate-favicon'); //remove when Gulp 4.0 is released
        }
    });
});
