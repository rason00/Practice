/* 开发版配置 */

const path = require('path');
const webpack = require('webpack');
// 多文件配置
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

module.exports = Merge(CommonConfig, {
  // 代码映射
  devtool: 'cheap-module-eval-source-map',
  // devtool: 'inline-source-map',
  // 本地服务器
  devServer: {
    //设置基本目录结构
    contentBase: path.resolve(__dirname, 'dist'),
    //服务器的IP地址，可以使用IP也可以使用localhost
    host: 'localhost',
    //服务端压缩是否开启
    compress: true,
    //配置服务端口号
    port: 1716
  },
  // 出口
  output: {
    filename: '[name].bundle.js',
    // publicPath: '/'
  },
  // 插件
  plugins: [
    // 多文件配置
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development') // 在编译的代码里设置了`process.env.NODE_ENV`变量
    }),
  ]
});