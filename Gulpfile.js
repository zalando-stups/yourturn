var gulp = require( 'gulp' ),
    gutil= require( 'gulp-util' ),
    eslint = require( 'gulp-eslint' ),
    webpack = require( 'webpack' );

gulp.task( 'pack', function( done ) {
    webpack(
        require( './webpack.config.js' ),
        function( err, data ) {
            if ( err ) {
                throw new gutil.PluginError( 'webpack', err );
            }
            gutil.log( '[webpack]', data.toString() );
        });
});

gulp.task( 'lint', function() {
    gulp
        .src([ 'src/app/**/*.jsx', 'src/app/**/*.js' ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});