const gulp = require("gulp"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  plumber = require("gulp-plumber"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  autoprefixer = require("gulp-autoprefixer"),
  imagemin = require("gulp-imagemin"),
  uglify = require("gulp-uglify"),
  del = require("del"),
  cleanCSS = require("gulp-clean-css");

gulp.task("sass", function () {
  return gulp
    .src("src/sass/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("styles.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["> 0.1%"],
        cascade: false,
      })
    )
    .pipe(cleanCSS())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("src/css"))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("libs", function () {
  return gulp
    .src([
      "src/libs/bootstrap/bootstrap-grid.css",
      "src/libs/owlcarousel/owl.carousel.min.css",
      "src/libs/owlcarousel/owl.theme.default.min.css",
    ])
    .pipe(concat("libs.css"))
    .pipe(cleanCSS())
    .pipe(rename("libs.min.css"))
    .pipe(gulp.dest("src/css"))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("html", function () {
  return gulp
    .src("src/*.html")
    .pipe(gulp.dest("dist/"));
});

gulp.task("libsjs", function () {
  return gulp
    .src([
      "src/libs/jquery/jquery-3.4.1.min.js",
      "src/libs/owlcarousel/owl.carousel.min.js",
      "src/libs/jquery.malihu.PageScroll2id/jquery.malihu.PageScroll2id.min.js",
    ])
    .pipe(concat("libs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("src/js"))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("scripts", function () {
  return gulp
    .src(["src/js/script.js"])
    .pipe(uglify())
    .pipe(rename("scripts.min.js"))
    .pipe(gulp.dest("src/js"))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("imgs", function () {
  return gulp
    .src("src/imgs/**/*.+(jpg|jpeg|png|gif|webp)")
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
      })
    )
    .pipe(gulp.dest("dist/imgs"));
});

gulp.task("fonts", function () {
  return gulp
    .src("src/fonts/**/*.+(ttf|woff|woff2|eot|svg)")
    .pipe(gulp.dest("dist/fonts"));
});

gulp.task("clean", function (done) {
  del.sync("dist");
  done();
});

gulp.task("watch", function () {
  gulp.watch("src/*.html", gulp.parallel("html"));
  gulp.watch("src/sass/**/*.scss", gulp.parallel("sass"));
  gulp.watch("src/js/script.js", gulp.parallel("scripts"));
  gulp.watch("src/imgs/*.+(jpg|jpeg|png|gif|webp)", gulp.parallel("imgs"));
  gulp.watch(
    "src/fonts/**/*.+(ttf|woff|woff2|eot|svg)",
    gulp.parallel("fonts")
  );
});

// Build Production Site with all updates
gulp.task(
  "build",
  gulp.series("html", "sass", "libs", "libsjs", "scripts", "imgs", "fonts")
);

// Watch for all file changes during work
gulp.task(
  "default",
  gulp.parallel(
    "build",
    "watch"
  )
);
