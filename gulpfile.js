var gutil = require('gulp-util');
var gulp = require('gulp');
var tsc = require('gulp-typescript-compiler');
var uglify = require('gulp-uglify');

gulp.task('typescript', function() {
    return gulp
        .src('src/*.ts')
        .pipe(tsc({
            module: '',
            sourcemap: false,
            logErrors: true
        }))
});

gulp.task('typescript_final', function() {
    return gulp
        .src('src/*.ts')
        .pipe(tsc({
            module: '',
            sourcemap: false,
            logErrors: true
        }))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('html_final', function() {
    return gulp
        .src('src/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('images_final', function() {
    return gulp
        .src('src/*.jpg')
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('src/*.ts', ['typescript']);
});

gulp.task('default', ['typescript', 'watch']);

gulp.task('final', ['typescript_final', 'html_final', 'images_final']);
