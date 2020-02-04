let gulp = require('gulp'),
     prefixer = require('gulp-autoprefixer'),
       clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    browserSync = require("browser-sync").create();

const path = {
    build: {
        html: 'build',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        webfonts: 'build/webfonts/',
        pages: 'build/pages/'
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
    clean: './build/'
};


const htmlBuild = () => (
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream())
);

const scssBuild = () => (
    gulp.src(path.src.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(clean())
        .pipe(prefixer({
            browsers: ['last 100 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream())

);

const jsBuild = () => (
    gulp.src(path.src.js)
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream())
);

const imgBuild = () => (
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            // use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream())
);

const fontsBuild = () => (
    gulp.src(path.src.webfonts)
        .pipe(gulp.dest(path.build.webfonts))
        .pipe(browserSync.stream())
);
const pagesBuild = () => (
    gulp.src(path.src.pages)
        .pipe(gulp.dest(path.build.pages))
        .pipe(browserSync.stream())
);

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    gulp.watch(path.watch.html, htmlBuild).on('change', browserSync.reload);
    gulp.watch(path.watch.style, scssBuild).on('change', browserSync.reload);
    gulp.watch(path.watch.js, jsBuild).on('change', browserSync.reload);
    gulp.watch(path.watch.img, imgBuild).on('change', browserSync.reload);
    gulp.watch(path.watch.webfonts, fontsBuild).on('change', browserSync.reload);
    gulp.watch(path.watch.pages, pagesBuild).on('change', browserSync.reload);
};

const cleanBuild = () => (
    gulp.src(path.clean, {allowEmpty: true})
        .pipe(clean())
);


/************ T A S K S ************/

gulp.task('htmlBuild', htmlBuild);
gulp.task('scssBuild', scssBuild);
gulp.task('jsBuild', jsBuild);
gulp.task('imgBuild', imgBuild);
gulp.task('fontsBuild', fontsBuild);
gulp.task('pagesBuild', pagesBuild);
gulp.task('watcher', watcher);

gulp.task('clean', cleanBuild);

gulp.task('default', gulp.series(
    cleanBuild,
    htmlBuild,
    scssBuild,
    jsBuild,
    gulp.parallel(fontsBuild,pagesBuild,imgBuild),
    watcher
));
