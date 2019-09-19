const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const OUTPUT_PATH = path.resolve(__dirname, 'docs');
const ENTRY_POINT = path.resolve(__dirname, 'src/index.js');
const HTML_TEMPLATE_PATH = path.join(__dirname, "public/index.html");
const P5_MIN_PACKAGE = path.resolve(__dirname, 'vendor/p5.min.js');
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
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            p5$: P5_MIN_PACKAGE,
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: HTML_TEMPLATE_PATH,
        })
    ],
    stats: {
        colors: true
    }
};
