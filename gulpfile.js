var gulp = require('gulp');
var coffee = require('gulp-coffee');
var minify = require('gulp-minify');


gulp.task('default', ['coffee']);

gulp.task('coffee', function() {
    gulp.src('./src/*.coffee')
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('compress', function() {
    gulp.src('./dist/*.js')
        .pipe(minify())
        .pipe(gulp.dest('./dist'))
});
