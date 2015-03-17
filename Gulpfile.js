var gulp = require('gulp'),
    gutil= require('gulp-util'),
    eslint = require('gulp-eslint'),
    args = require('minimist')(process.argv.slice(2)),
    del = require( 'del' ),
    browserSync = require('browser-sync'),
    webpack = require('webpack');

/**
 * Deletes files or directories
 * @param  {array} globs Globs describing things to remove
 * @return {function} Function that deletes the things
 */
function remove(globs) {
    return function(done) {
        del(globs, done);
    };
}

// removes the output folder
gulp.task( 'clean', remove(['dist/**/*']));

// runs webpack and creates a bundle
gulp.task('pack', ['clean'], function(done) {
    var webpackConfig = require('./webpack.config');
    // here we could override production-specific properties
    webpack(
        webpackConfig,
        function(err, data) {
            if (err) {
                throw new gutil.PluginError('webpack', err);
            }
            gutil.log('[webpack]', data.toString());
        });
});

// starts browsersync
gulp.task('sync', function() {
    browserSync({
        proxy: 'localhost:3000'
    });
});

// lints the source code using .eslintrc
gulp.task('lint', function() {
    return gulp
            .src(['lib/**/*.jsx', 'lib/**/*.js'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
});

// watches changes in js, lints cocde
gulp.task('watch:js', function() {
    return  gulp.watch([
                'lib/**/*.jsx',
                'lib/**/*.js'
            ],
            ['lint']);
});

gulp.task('watch', ['watch:js', 'sync']);
gulp.task('default', ['watch']);