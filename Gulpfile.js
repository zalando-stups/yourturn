var gulp = require('gulp'),
    gutil= require('gulp-util'),
    eslint = require('gulp-eslint'),
    less = require('gulp-less'),
    vendorprefix = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    webpack = require('webpack');

gulp.task('pack', function(done) {
    webpack(
        require('./webpack.config.js'),
        function(err, data) {
            if (err) {
                throw new gutil.PluginError('webpack', err);
            }
            gutil.log('[webpack]', data.toString());
        });
});

gulp.task('sync', function() {
    browserSync({
        files: 'css/**/*.css',
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('lint', function() {
    return gulp
            .src(['src/app/**/*.jsx', 'src/app/**/*.js'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
});

gulp.task('watch:js', function() {
    return  gulp.watch([
                'src/app/**/*.jsx',
                'src/app/**/*.js'
            ],
            ['lint']);
});

gulp.task('less', function() {
    return gulp
            .src('src/asset/less/**/*.less')
            .pipe(less())
            .pipe(vendorprefix())
            .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch:less', function() {
    return gulp.watch('src/asset/less/**/*.less', ['less', 'sync']);
});

gulp.task('watch', ['watch:less', 'watch:js']);
gulp.task('default', ['watch']);