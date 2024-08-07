const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'blockly-app/wwwsrc/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'blockly-app/wwwdist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/preset-env' ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'blockly-app/wwwsrc/index.html')
        })
    ],
    resolve: {
        alias: {
            blockly: path.resolve(__dirname, 'node_modules/blockly'),
            'js-interpreter': path.resolve(__dirname, 'node_modules/js-interpreter')
        },
        fallback: {
            vm: false
        }
    }
}