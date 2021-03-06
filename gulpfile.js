var gutil = require('gulp-util');
var gulp = require('gulp');
var tsc = require('gulp-typescript-compiler');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

gulp.task('typescript', function() {
    return gulp
        .src('src/*.ts')
        .pipe(tsc({
            module: '',
            sourcemap: false,
            logErrors: true
        })).
        pipe(gulp.dest('dist'));
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

gulp.task('html', function() {
    return gulp
        .src('src/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp
        .src('src/*.jpg')
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('src/*.ts', ['typescript']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/*.jpg', ['images']);
});

gulp.task('zip', function() {
    return gulp.src('dist/*.!(zip)')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['typescript', 'html', 'images', 'watch']);

gulp.task('final', ['typescript_final', 'html', 'images', 'zip']);
