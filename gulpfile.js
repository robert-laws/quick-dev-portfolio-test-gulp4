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

gulp.task('clean', function() {
  return del(['build']);
});

gulp.task('pug', function() {
  var stream = gulp.src(paths.pug.src)
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.pug.dest));
  return stream;
});

gulp.task('styles', function() {
  var stream = gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on("error", sass.logError))
    .pipe(prefix(prefixerOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest));
  return stream;
});

gulp.task('scripts', function() {
  var stream = gulp.src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dest));
  return stream;
});

gulp.task('images', function() {
  var stream = gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
  return stream;
});

gulp.task('browser', function() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch(paths.pug.watch, gulp.parallel('pug'))
    .on('change', browserSync.reload);

  // watch and rebuild .js files
  gulp.watch(paths.scripts.src, gulp.parallel('scripts'))
    .on('change', browserSync.reload);
 
  // watch and rebuild .css files
  gulp.watch(paths.styles.src, gulp.parallel('styles'))
    .on('change', browserSync.reload);
 
  // Reload when html changes
  gulp.watch(paths.images.src, gulp.parallel('images'))
    .on('change', browserSync.reload);
})

gulp.task('serve', gulp.series('clean',
  gulp.parallel(
    'pug',
    'styles',
    'scripts',
    'images'),
  'browser'));

gulp.task('default', gulp.series('serve'));