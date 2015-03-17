var gulp = require('gulp'),
    gutil= require('gulp-util'),
    eslint = require('gulp-eslint'),
    args = require('minimist')(process.argv.slice(2)),
    del = require( 'del' ),
    browserSync = require('browser-sync'),
    webpack = require('webpack');

function remove(globs) {
    return function(done) {
        del(globs, done);
    };
}

gulp.task( 'clean', remove(['dist/**/*']));

gulp.task('pack', ['clean'], function(done) {
    var webpackConfig = require('./webpack.config');

    webpack(
        webpackConfig,
        function(err, data) {
            if (err) {
                throw new gutil.PluginError('webpack', err);
            }
            gutil.log('[webpack]', data.toString());
        });
});

gulp.task('sync', function() {
    browserSync({
        proxy: 'localhost:3000'
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
gulp.task('watch', ['watch:js', 'sync']);
gulp.task('default', ['watch']);