var path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const OUTPUT_PATH = path.resolve(__dirname, 'docs');
const ENTRY_POINT = path.resolve(__dirname, 'src/index.ts');
const HTML_TEMPLATE_PATH = path.join(__dirname, "public/index.html")
const BUNDLE_NAME = 'bundle.js'

module.exports = {
    entry: ENTRY_POINT,
    output: {
        path: OUTPUT_PATH,
        filename: BUNDLE_NAME
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-typescript']
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: HTML_TEMPLATE_PATH,
        })
    ],
    resolve: {
        extensions: [".ts",".js"]
    },
    devServer: {
        static: OUTPUT_PATH,
        port: 8000
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
