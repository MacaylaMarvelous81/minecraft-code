import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    entry: path.resolve(import.meta.dirname, 'wwwsrc/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(import.meta.dirname, 'wwwdist')
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
            template: path.resolve(import.meta.dirname, 'wwwsrc/index.html')
        })
    ],
    resolve: {
        alias: {
            blockly: path.resolve(import.meta.dirname, 'node_modules/blockly'),
            'js-interpreter': path.resolve(import.meta.dirname, 'node_modules/js-interpreter')
        },
        fallback: {
            vm: false
        }
    }
}