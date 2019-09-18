var path = require('path');

const OUTPUT_PATH = path.resolve(__dirname, 'docs');
const ENTRY_POINT = path.resolve(__dirname, 'src/index.js');
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
    stats: {
        colors: true
    }
};
