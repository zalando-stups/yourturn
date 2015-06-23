/**
 * Development configuration
 */
var webpack = require('webpack'),
    path = require('path');

module.exports = {
    devtool: 'eval',
    entry: [
        /* react hot loader */
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './lib/yourturn/src/bootstrap.jsx'   // entrypoint to resolve dependencies
    ],
    output: {
        path: __dirname + '/dist/',
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NormalModuleReplacementPlugin(/^lodash$/, 'common/src/lodash.custom'),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            ENV_DEVELOPMENT: true,
            ENV_TEST: false
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
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel'] },
            { test: /\.less$/, exclude: /node_modules/, loaders: ['style', 'css', 'autoprefixer', 'less'] },
            { test: /\.css$/, loaders: ['style', 'css'] },
            { test: /\.(otf|eot|svg|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=application/font-woff' },
            { test: /\.(png|jpg|jpeg|gif)$/, loaders: ['url?limit=8192', 'img']}
        ]
    }
};
