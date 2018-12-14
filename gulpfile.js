var gulp = require("gulp");
var pug = require("gulp-pug");
var sass = require("gulp-sass");
var prefix = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var del = require("del");
var browserSync = require("browser-sync").create();

var paths = {
  styles: {
    src: "src/sass/**/*.scss",
    dest: "build/styles"
  },
  pug: {
    src: "src/pug/*.pug",
    watch: "src/pug/**/*.pug",
    dest: "build"
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "build/scripts"
  },
  images: {
    src: ["src/images/**/*.jpg", "src/images/**/*.JPG", "src/images/**/*.png", "src/images/**/*.ico"],
    dest: "build/img"
  }
}

var sassOptions = {
  outputStyle: "expanded"
};

var prefixerOptions = {
  browsers: ['last 2 versions']
};

function clean() {
  return del(['build']);
}

function pug() {
  return gulp.src(paths.pug.src)
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browserSync.stream())    
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on("error", sass.logError))
    .pipe(prefix(prefixerOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream())
}

function images() {
  return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
  gulp.watch(paths.pug.src, pug);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
}

exports.clean = clean;
exports.pug = pug;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watch;

var build = gulp.series(clean, gulp.parallel(styles, scripts));

gulp.tasks('build', build);
gulp.tasks('default', gulp.series(build, watch));