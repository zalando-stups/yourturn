module.exports = {
    entry: './src/app/bootstrap.jsx',
    output: {
        filename: './dist/bundle.js'       
    },
    module: {
        loaders: [
            // { test: /\.jsx$/, exclude: /node_modules/, loaders: ['babel-loader', 'jsx-loader'] }
            { test: /\.jsx$/, exclude: /node_modules/, loader: 'jsx-loader' }
        ]
    }
};