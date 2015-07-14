var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    gutil= require('gulp-util'),
    eslint = require('gulp-eslint'),
    jscs = require('gulp-jscs'),
    args = require('minimist')(process.argv.slice(2)),
    scm = require('@zalando/node-scm-source'),
    del = require( 'del' ),
    shell = require('gulp-shell'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    critical = require('critical'),
    webpack = require('webpack');

var LODASH_FUNCS = [
        // own
        'chain',
        'debounce',
        'extend',
        'filter',
        'findLastIndex',
        'flatten',
        'forOwn',
        'groupBy',
        'intersection',
        'pluck',
        'reverse',
        'sortBy',
        'slice',
        'take',
        'times',
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
        del(globs, done);
    };
}

// removes the output folder
gulp.task( 'clean', remove(['dist/**/*']));

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

gulp.task('scm-source', function(done) {
    fs.writeFile('../scm-source.json', JSON.stringify(scm(), null, 4), done);
});

// lints the source code using .eslintrc
gulp.task('lint', function() {
    return gulp
            .src(['lib/**/*.js', 'lib/**/*.jsx', '!lib/common/src/lodash.custom.js'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
});

gulp.task('copy', function() {
    return gulp
            .src('stups_favicon.png')
            .pipe(gulp.dest('dist'));
});

gulp.task('extract-atf-css', ['cachebust', 'pack'], function(done) {
    var html = String(fs.readFileSync(path.join(__dirname + '/dist/index-prod.html')));
    // remove some stuff that critical doesn't like
    html = html
            .replace(/\?v=\d+/gi, '')
            .replace(/\/dist\//gi, '');

    critical.generate({
        base: './dist',
        html: html,
        dest: 'site.css',
        dimensions: [{
            // generic 13" laptop
            width: 1280,
            height: 800
        }, {
            // iphone 4s
            width: 640,
            height: 960
        }],
        minify: true
    }, function(err, css) {
        if (err) {
            console.log(err);
            return;
        }
        done();
    });
});

gulp.task('inline-atf-css', ['extract-atf-css'], function(done) {
    var inline = String(fs.readFileSync(path.join(__dirname + '/dist/site.css')));
    return gulp
            .src('dist/index-prod.html')
            .pipe(replace('${inline}', inline))
            .pipe(rename('index.html'))
            .pipe(gulp.dest('dist'));
});

gulp.task('cachebust', ['clean'], function() {
    return gulp
                .src('index-prod.html')
                .pipe(replace('${timestamp}', Date.now()))
                .pipe(gulp.dest('dist'));
});

gulp.task('build', ['pack', 'inline-atf-css', 'copy', 'scm-source']);

gulp.task('watch', ['watch:js']);
gulp.task('default', ['watch']);
