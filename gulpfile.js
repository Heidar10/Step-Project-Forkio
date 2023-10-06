import gulp from "gulp";
const {src, dest, watch, series, parallel} = gulp;

import clean from "gulp-clean";

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

import autoprefixer from "gulp-autoprefixer";

import cleanScc from "gulp-clean-css";

import minifyJs from "gulp-js-minify";

import concat from "gulp-concat";

import browserSync from "browser-sync"
const bsServer = browserSync.create();

import imageMin from "gulp-imagemin";

import groupMedia from "gulp-group-css-media-queries";
function deleteDist() {
    return src("./dist/*", {"allowEmpty" : true}).pipe(clean());
}

function styles() {
    return src("./src/styles/style.scss")
        .pipe(autoprefixer( ["last 15 versions", "> 1%", "ie 8", "ie 7"], {
                cascade: true,
            }
        ))
        .pipe(sass().on('error', sass.logError))
        .pipe(groupMedia())
        .pipe(concat("./styles.min.css"))
        .pipe(dest("./dist/css/"))
        .pipe(bsServer.reload({stream : true}));
}

function scripts() {
    return src("./src/js/*.js")
        .pipe(concat("./js/script.min.js"))
        .pipe(minifyJs())
        .pipe(dest("./dist/"));
    
}

function images() {
    return src("./src/img/**/*")
        .pipe(imageMin())
        .pipe(dest("dist/img"))

}

function serve() {
    bsServer.init({
        server: {
            baseDir: "./",
            browser: "firefox",
        }
    });
}

function watcher() {
    watch("./src/styles/**/*.scss",styles);

    watch("*.html").on("change", bsServer.reload);
    watch("./src/js/*.js").on("change", series(scripts,bsServer.reload));
    watch("./src/img/**/*.{jpg,jpeg,png,svg,webp}").on(
        "change",
        series(images, bsServer.reload)
    );
}


export const build = series(deleteDist,parallel(styles,scripts,images));

export const dev = parallel(serve,watcher);