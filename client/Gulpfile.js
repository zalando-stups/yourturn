var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    gutil= require('gulp-util'),
    autoprefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-cssnano'),
    less = require('gulp-less'),
    eslint = require('gulp-eslint'),
    jscs = require('gulp-jscs'),
    del = require( 'del' ),
    shell = require('gulp-shell'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    webpack = require('webpack');

process.on('uncaughtException', function(e) {
    console.error(e);
    process.exit(1);
});

var LODASH_FUNCS = [
        // own
        'chain',
        'debounce',
        'defer',
        'difference',
        'extend',
        'filter',
        'findLastIndex',
        'flatten',
        'forOwn',
        'groupBy',
        'intersection',
        'isEmpty',
        'partition',
        'pluck',
        'reverse',
        'sortBy',
        'sortByOrder',
        'slice',
        'take',
        'throttle',
        'times',
        'unique',
        'value',
        'values'
    ],
    LODASH_INCLUDE = 'include=' + LODASH_FUNCS.join(',');

/**
 * Deletes files or directories
 * @param  {array} globs Globs describing things to remove
 * @return {function} Function that deletes the things
 */
function remove(globs) {
    return function(done) {
        return del(globs, done);
    };
}

function readFile(file) {
    return String(fs.readFileSync(path.join(__dirname + file)));
}

// removes the output folder
gulp.task('clean', remove(['dist/**/*']));

// custom lodash build
gulp.task('lodash', shell.task([
    '../node_modules/lodash-cli/bin/lodash modern ' + LODASH_INCLUDE + ' -d -o lib/common/src/lodash.custom.js'
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

gulp.task('format', function() {
    return gulp
            .src(['lib/**/*.js', '!lib/common/src/lodash.custom.js'])
            .pipe(jscs({
                esnext: true,
                configPath: './.jscsrc'
            }));
});

// lints the source code using .eslintrc
gulp.task('lint', function() {
    return gulp
            .src(['lib/**/*.js', 'lib/**/*.jsx', '!lib/common/src/lodash.custom.js'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
});

gulp.task('copy', ['clean'], function() {
    return gulp
            .src('stups_favicon.png')
            .pipe(gulp.dest('dist'));
});

gulp.task('extract-inline-css', ['clean'], function() {
    return gulp
            .src('lib/common/asset/less/**/*.less')
            .pipe(less({
                paths: [path.join(__dirname, 'lib/common/asset/less/')]
            }))
            .pipe(autoprefix())
            .pipe(minifyCSS())
            .pipe(gulp.dest('dist/css'));
});

gulp.task('inline-css', ['extract-inline-css'], function(done) {
    var inline = readFile('/dist/css/grid.css') +
                 readFile('/dist/css/base.css') +
                 readFile('/dist/css/button.css') +
                 readFile('/dist/css/yourturn/sidebar.css');
    return gulp
            .src('index-prod.html')
            .pipe(replace('${inline}', inline))
            .pipe(replace('${timestamp}', Date.now()))
            .pipe(rename('index.html'))
            .pipe(gulp.dest('dist'));
});

gulp.task('build', ['pack', 'inline-css', 'copy']);
