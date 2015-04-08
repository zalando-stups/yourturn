var gulp = require('gulp'),
    gutil= require('gulp-util'),
    eslint = require('gulp-eslint'),
    args = require('minimist')(process.argv.slice(2)),
    del = require( 'del' ),
    replace = require('gulp-replace'),
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
    var webpackConfig = require('./webpack.production.config');
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

// lints the source code using .eslintrc
gulp.task('lint', function() {
    return gulp
            .src(['lib/**/*.js'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
});

// watches changes in js, lints cocde
gulp.task('watch:js', function() {
    return  gulp.watch([
                'lib/**/*.js'
            ],
            ['lint']);
});

gulp.task('cachebust', function() {
    return gulp
                .src('index.html')
                .pipe( replace('${timestamp}', Date.now()) )
                .pipe( gulp.dest( 'dist' ) );
});

gulp.task('build', ['pack', 'cachebust']);

gulp.task('watch', ['watch:js']);
gulp.task('default', ['watch']);