/**
 * Creates a bundle for use in production.
 */
var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path');

module.exports = {
    devtool: 'eval',
    bail: true, // break on error
    entry: [
        './lib/yourturn/src/bootstrap'   // entrypoint to resolve dependencies
    ],
    output: {
        path: __dirname + '/dist/',
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.PrefetchPlugin('remarkable'),
        new webpack.PrefetchPlugin('moment'),
        new webpack.PrefetchPlugin('common/src/superagent'),
        new webpack.NormalModuleReplacementPlugin(/^lodash$/, 'common/src/lodash.custom'),
        new webpack.NormalModuleReplacementPlugin(/underscore/, 'common/src/lodash.custom'),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('style.css', {
            allChunks: true
        }),
        new webpack.DefinePlugin({
            ENV_DEVELOPMENT: false,
            ENV_TEST: false
        })
    ],
    resolve: {
        extensions: ['', '.js', '.scss'],
        alias: {
            common: path.resolve(__dirname, './lib/common/'),
            yourturn: path.resolve(__dirname, './lib/yourturn/'),
            application: path.resolve(__dirname, './lib/application/'),
            resource: path.resolve(__dirname, './lib/resource/')
        }
    },
    // prefix everything with YTENV_
    externals: {
        OAUTH_CLIENT_ID: 'YTENV_OAUTH_CLIENT_ID',
        OAUTH_AUTH_URL: 'YTENV_OAUTH_AUTH_URL',
        OAUTH_REDIRECT_URI: 'YTENV_OAUTH_REDIRECT_URI',
        OAUTH_SCOPES: 'YTENV_OAUTH_SCOPES',
        KIO_BASE_URL: 'YTENV_KIO_BASE_URL',
        TWINTIP_BASE_URL: 'YTENV_TWINTIP_BASE_URL',
        MINT_BASE_URL: 'YTENV_MINT_BASE_URL',
        ESSENTIALS_BASE_URL: 'YTENV_ESSENTIALS_BASE_URL',
        TEAM_BASE_URL: 'YTENV_TEAM_BASE_URL',
        PIERONE_BASE_URL: 'YTENV_PIERONE_BASE_URL',
        DOCKER_REGISTRY: 'YTENV_DOCKER_REGISTRY',
        SERVICE_URL_TLD: 'YTENV_SERVICE_URL_TLD'
    },
    eslint: {
        configFile: './.eslintrc',
        failOnError: true
    },
    jscs: {
        esnext: true,
        failOnHint: true
    },
    module: {
        preLoaders: [
            { test: /\.js$/, exclude: /(node_modules|lodash)/, loaders: ['jscs', 'eslint'] }
        ],
        loaders: [
            { test: /\.hbs$/, exclude: /node_modules/, loader: 'handlebars?helperDirs[]=' + __dirname + '/lib/common/src/handlebars' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!sass') },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=8192&mimetype=application/font-woff" },
            { test: /\.(png|jpg|jpeg|gif)$/, loaders: ['url?limit=8192', 'img']}
        ]
    }
};
