var webpack = require('webpack'),
    path = require('path');

module.exports = {
    devtool: 'eval',    // write source-map here if we want source maps
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './lib/application/src/bootstrap-application.jsx'   // entrypoint to resolve dependencies
    ],
    output: {
        path: __dirname + '/dist/',
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin()
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
            { test: /\.jsx$/, exclude: /node_modules/, loaders: ['react-hot', 'babel'] },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.scss$/, exclude: /node_modules/, loaders: ['style', 'css', 'autoprefixer', 'sass'] }
        ]
    }
};