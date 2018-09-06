const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'production',
  // 插件
  plugins: [
    // 配置变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production') // 在编译的代码里设置了`process.env.NODE_ENV`变量
    }),
  ]
});