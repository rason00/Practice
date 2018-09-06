const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  // 本地服务器
  devServer: {
    //设置基本目录结构
    contentBase: path.resolve(__dirname, 'dist'),
    //服务器的IP地址，可以使用IP也可以使用localhost
    host: '127.0.0.1',
    //服务端压缩是否开启
    compress: true,
    //配置服务端口号
    port: 1717,
    // 热更新
    hot: true
  },
  // 插件
  plugins: [
    // 热更新
    new webpack.HotModuleReplacementPlugin(),
    // 配置变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development') // 在编译的代码里设置了`process.env.NODE_ENV`变量
    }),
  ]
});