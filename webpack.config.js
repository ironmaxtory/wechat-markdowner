var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name]_css.[hash:8].css');
const extractLESS = new ExtractTextPlugin('[name]_less.[hash:8].css');

var ROOT_PATH = path.resolve(__dirname);
var SRC_PATH = path.resolve(ROOT_PATH, './src');
var DIST_PATH = path.resolve(ROOT_PATH, './md');

module.exports = {
    //页面入口文件配置
    entry: {
        index : path.resolve(SRC_PATH, 'js/index.js'),
    },
    //入口文件输出配置
    output: {
        publicPath: '/dist/',
        path: path.resolve(DIST_PATH, 'js'),
        filename: '[name].js'
    },
    devServer: {
        hot: true,
        inline: true,
        historyApiFallback: false,
        disableHostCheck: true,
    },
    module: {
        //加载器配置
        loaders: [
          {
            test: /\.css$/,
            use: extractCSS.extract(['css-loader']),
            // loader: 'style-loader!css-loader'
          },
          {
            test: /\.less$/,
            use: extractLESS.extract(['css-loader', 'less-loader?sourceMap']),
            // loader: 'style-loader!css-loader!less-loader?sourceMap'
          },
          { test: /\.js$/, loader: 'jsx-loader?harmony' },
          { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    plugins: [
        // 生成页面插件
        new HtmlWebpackPlugin({
          filename: 'index.html',  //默认目录路径为output.publicPath
          template: './src/index.html', //默认目录路径为根目录
          inject: true,
        }),
        extractCSS,
        extractLESS,
        new CopyWebpackPlugin([
            {
                context: path.join(__dirname, './src/css/pageThemes'),
                from: '*',
                to: './pageThemes',  // to的默认路径为output.publicPath
                force: true
            },
            {
                context: path.join(__dirname, './src/imgs'),
                from: '*',
                to: './imgs',
                force: true
            },
            {
                context: path.join(__dirname, './src/css/themes'),
                from: '*',
                to: './themes',
                force: true
            },
            {
                context: path.join(__dirname, './src'),
                from: "demo.md",
                to: './demo.md',
                force: true
            },
            {
                context: path.join(__dirname, './src'),
                from: "favicon.ico",
                to: './favicon.ico',
                force: true
            },
            {
                context: path.join(__dirname, './src'),
                from: "CNAME",
                to: './CNAME',
                toType: 'file',
                force: true
            }
        ])
    ]
};
