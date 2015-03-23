var webpack = require('webpack'),
    path = require('path');

module.exports = {
    devtool: 'eval',
    entry: [
        './lib/yourturn/src/bootstrap-yourturn.jsx'
    ],
    output: {
        path: __dirname + '/dist/',
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            ENV_PRODUCTION: true
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.scss'],
        alias: {
            common: path.resolve(__dirname, './lib/common/'),
            application: path.resolve(__dirname, './lib/application/')
        }
    },
    module: {
        loaders: [
            { test: /\.jsx$/, exclude: /node_modules/, loaders: ['babel'] },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.scss$/, exclude: /node_modules/, loaders: ['style', 'css', 'autoprefixer', 'sass'] },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
        ]
    }
};