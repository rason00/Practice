/* 生产版配置 */
const path = require('path');
const webpack = require('webpack');
// 多文件配置
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

module.exports = Merge(CommonConfig, {
  // 代码映射
  devtool: 'cheap-module-source-map',
  // 出口
  output: {
    filename: '[name].[hash:8].js',
    // publicPath: '/'
  },
  // 插件
  plugins: [
    // 多文件配置
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // 压缩 JS 文件
    new webpack.optimize.UglifyJsPlugin()
  ]
});