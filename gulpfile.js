let gulp = require('gulp'),
     prefixer = require('gulp-autoprefixer'),
       clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    browserSync = require("browser-sync").create();

const path = {
    dist: {
        html: 'dist',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        webfonts: 'dist/webfonts/',
        pages: 'dist/pages/'
    },
    src: {
        html: 'src/index.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        pages: 'src/pages/**/*.*',
        webfonts: 'src/webfonts/**/*.*'
    },
    watch: {
        html: 'src/index.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        pages: 'src/pages/**/*.*',
        webfonts: 'src/webfonts/**/*.*'
    },
    clean: './dist/'
};


const htmldist = () => (
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.dist.html))
        .pipe(browserSync.stream())
);

const scssdist = () => (
    gulp.src(path.src.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(clean())
        .pipe(prefixer({
            browsers: ['last 100 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.dist.css))
        .pipe(browserSync.stream())

);

const jsdist = () => (
    gulp.src(path.src.js)
        .pipe(gulp.dest(path.dist.js))
        .pipe(browserSync.stream())
);

const imgdist = () => (
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            // use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img))
        .pipe(browserSync.stream())
);

const fontsdist = () => (
    gulp.src(path.src.webfonts)
        .pipe(gulp.dest(path.dist.webfonts))
        .pipe(browserSync.stream())
);
const pagesdist = () => (
    gulp.src(path.src.pages)
        .pipe(gulp.dest(path.dist.pages))
        .pipe(browserSync.stream())
);

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch(path.watch.html, htmldist).on('change', browserSync.reload);
    gulp.watch(path.watch.style, scssdist).on('change', browserSync.reload);
    gulp.watch(path.watch.js, jsdist).on('change', browserSync.reload);
    gulp.watch(path.watch.img, imgdist).on('change', browserSync.reload);
    gulp.watch(path.watch.webfonts, fontsdist).on('change', browserSync.reload);
    gulp.watch(path.watch.pages, pagesdist).on('change', browserSync.reload);
};

const cleandist = () => (
    gulp.src(path.clean, {allowEmpty: true})
        .pipe(clean())
);


/************ T A S K S ************/

gulp.task('htmldist', htmldist);
gulp.task('scssdist', scssdist);
gulp.task('jsdist', jsdist);
gulp.task('imgdist', imgdist);
gulp.task('fontsdist', fontsdist);
gulp.task('pagesdist', pagesdist);
gulp.task('watcher', watcher);

gulp.task('clean', cleandist);

gulp.task('default', gulp.series(
    cleandist,
    htmldist,
    scssdist,
    jsdist,
    gulp.parallel(fontsdist,pagesdist,imgdist),
    watcher
));
