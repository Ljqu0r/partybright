const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();


function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        // tunnel: true
    });
    gulp.watch('./src/sass/**/*.scss', fromSASSToCSS);
    gulp.watch('./*.html', browserSync.reload);
}


//clean build folder function
function clean() {
    return del(['build/*']);
}

//from sass to css function
function fromSASSToCSS() {
    return gulp.src('./src/sass/**/main.scss')
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(sass.sync({
            // outputStyle: 'compressed'
        }))
        .on('error', notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Sass error'
        }))
        .pipe(rename({
            suffix: '.min',
            prefix: ''
        }))
        .pipe(sourcemaps.init())
        // .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

gulp.task('img', () =>
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./images'))
);
gulp.task('fonts', () =>
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('./build/fonts'))
);

gulp.task('watch', watch);  //watch task
gulp.task('sass', gulp.series(fromSASSToCSS, watch));  //task for compile scss to css and watch
gulp.task('clean', clean);   //task for clean build folder
gulp.task('build', gulp.series('clean', 'img', 'fonts', 'sass', 'watch'));   //build project task