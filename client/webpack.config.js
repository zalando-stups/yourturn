var webpack = require('webpack'),
    path = require('path');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack/hot/dev-server',
        './lib/yourturn/src/bootstrap'   // entrypoint to resolve dependencies
    ],
    output: {
        path: __dirname + '/dist/',
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            ENV_PRODUCTION: false
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
    externals: {
        KIO_BASE_URL: 'YTENV_KIO_BASE_URL',
        TWINTIP_BASE_URL: 'YTENV_TWINTIP_BASE_URL',
        DOCKER_REGISTRY: 'YTENV_DOCKER_REGISTRY',
        SERVICE_URL_TLD: 'YTENV_SERVICE_URL_TLD'
    },
    module: {
        loaders: [
            { test: /\.hbs$/, exclude: /node_modules/, loader: 'handlebars' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.scss$/, exclude: /node_modules/, loaders: ['style', 'css', 'autoprefixer', 'sass'] },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url?limit=10000&mimetype=application/font-woff' },
        ]
    }
};
