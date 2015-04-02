var webpack = require('webpack'),
    path = require('path');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:3000',
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
            application: path.resolve(__dirname, './lib/application/')
        }
    },
    externals: {
        KIO_BASE_URL: 'YTENV_KIO_BASE_URL',
        TWINTIP_BASE_URL: 'YTENV_TWINTIP_BASE_URL'
    },
    module: {
        loaders: [
            { test: /\.hbs$/, exclude: /node_modules/, loader: 'handlebars' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.scss$/, exclude: /node_modules/, loaders: ['style', 'css', 'autoprefixer', 'sass'] },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
        ]
    }
};