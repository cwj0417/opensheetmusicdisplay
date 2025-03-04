var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')

module.exports = {
    // mode: 'development',
    mode: 'production',
    devtool: false,
    entry: {
        demo: './demo/index.js' // Demo index
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        globalObject: 'this'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.glsl$/,
                type: "asset/source",
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            STATIC_FILES_SUBFOLDER: false, // Set to other directory if NOT using webpack-dev-server
            DEBUG: false,
            DRAW_BOUNDING_BOX_ELEMENT: false //  Specifies the element to draw bounding boxes for (e.g. 'GraphicalLabels'). If 'all', bounding boxes are drawn for all elements.
        }),
        // add a demo page to the build folder
        new HtmlWebpackPlugin({
            template: 'demo/index.html',
            title: 'OpenSheetMusicDisplay Demo'
        })
    ],
    devServer: {
        static: [
            path.join(__dirname, 'test/data'),
            path.join(__dirname, 'build'),
            path.join(__dirname, 'demo')
        ],
        port: 8000,
        compress: false
    }
}
