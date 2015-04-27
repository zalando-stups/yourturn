var gulp = require('gulp'),
    gutil= require('gulp-util'),
    eslint = require('gulp-eslint'),
    args = require('minimist')(process.argv.slice(2)),
    del = require( 'del' ),
    shell = require('gulp-shell'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    webpack = require('webpack');

var LODASH_FUNCS = [
        // own
        'chain',
        'sortBy',
        'reverse',
        'take',
        'forOwn',
        'value',
        // backbone
        'once',
        'keys',
        'uniqueId',
        'isEmpty',
        'extend',
        'defaults',
        'clone',
        'escape',
        'isEqual',
        'has',
        'isObject',
        'result',
        'each',
        'isArray',
        'isString',
        'matches',
        'bind',
        'invoke',
        'isFunction',
        'pick',
        'isRegExp',
        'map',
        'bindAll',
        'any'
    ],
    LODASH_INCLUDE = 'include=' + LODASH_FUNCS.join(',');

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

// custom lodash build
gulp.task('lodash', shell.task([
    'lodash modern ' + LODASH_INCLUDE + ' -d -o lib/common/src/lodash.custom.js'
]));

// runs webpack and creates a bundle
gulp.task('pack', ['clean', 'lodash'], function(done) {
    var webpackConfig = require('./webpack.production.config');
    // here we could override production-specific properties
    webpack(
        webpackConfig,
        function(err, data) {
            if (err) {
                throw new gutil.PluginError('webpack', err);
            }
            gutil.log('[webpack]', data.toString());
            done();
        });
});

gulp.task('copy', function() {
    return gulp
            .src('stups_favicon.png')
            .pipe(gulp.dest('dist'));
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
                .src('index-prod.html')
                .pipe( replace('${timestamp}', Date.now()) )
                .pipe( rename('index.html') )
                .pipe( gulp.dest( 'dist' ) );
});

gulp.task('build', ['pack', 'cachebust', 'copy']);

gulp.task('watch', ['watch:js']);
gulp.task('default', ['watch']);