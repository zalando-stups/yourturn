/**
 * Creates a bundle for use in production.
 */
var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path');

module.exports = {
    devtool: 'cheap-module-source-map',
    bail: true, // break on error
    entry: [
        './lib/yourturn/src/bootstrap.jsx'   // entrypoint to resolve dependencies
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
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('style.css', {
            allChunks: true
        }),
        new webpack.DefinePlugin({
            ENV_DEVELOPMENT: false,
            ENV_TEST: false,
            'process.env': {
                NODE_ENV: '"production"'  // causes react to lose weight
            }
        })
    ],
    resolve: {
        alias: {
            common: path.resolve(__dirname, './lib/common/'),
            yourturn: path.resolve(__dirname, './lib/yourturn/'),
            application: path.resolve(__dirname, './lib/application/'),
            resource: path.resolve(__dirname, './lib/resource/'),
            violation: path.resolve(__dirname, './lib/violation/')
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
        PIERONE_BASE_URL: 'YTENV_PIERONE_BASE_URL',
        FULLSTOP_BASE_URL: 'YTENV_FULLSTOP_BASE_URL',
        DOCKER_REGISTRY: 'YTENV_DOCKER_REGISTRY',
        SERVICE_URL_TLD: 'YTENV_SERVICE_URL_TLD',
        RESOURCE_WHITELIST: 'YTENV_RESOURCE_WHITELIST'
    },
    eslint: {
        configFile: './.eslintrc',
        failOnError: true
    },
    jscs: {
        emitErrors: false,
        failOnHint: false,
        reporter: function(errors) {
            console.log(errors);
            errors._errorList.forEach(function(err) {
                console.log(err.message);
            });
        }
    },
    module: {
        preLoaders: [
            { test: /\.jsx?$/, exclude: /(node_modules|lodash)/, loaders: ['eslint'] }
        ],
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel'] },
            { test: /\.less$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('css!autoprefixer!less') },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('css!autoprefixer') },
            { test: /\.(otf|eot|svg|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=application/font-woff' },
            { test: /\.(png|jpg|jpeg|gif)$/, loaders: ['url?limit=8192', 'img']}
        ]
    }
};
