/* 公共配置 */
const path = require('path');
const webpack = require('webpack');
// 打包html
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理dist
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 压缩JS代码
const uglify = require('uglifyjs-webpack-plugin');
// css分离
const extractTextPlugin = require('extract-text-webpack-plugin');
// 消除css
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

module.exports = {
  // 入口
  entry: {
    // './js/index': path.resolve(__dirname, 'src/index.js'),
    app : './src/index.js',
    // jquery: 'jquery',
  },
  // 出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    // publicPath: './'
  },
  // 插件
  plugins: [
    // 压缩代码
    new uglify(),
    // 打包html
    new HtmlWebpackPlugin({
      // title: '南航e行功能秘籍h5',
      // filename: 'index.html',
      // 对html文件进行压缩
      minify: {
        // 是否去掉属性的双引号
        removeAttributeQuotes: true
      },
      // 避免缓存JS
      hash: true,
      // 要打包的html模版路径和文件名称
      template: './src/index.html',
      inject: true,
    }),
    // css分离
    new extractTextPlugin('css/[name].[hash:8].css'),
    // css消除
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
    }),
    // 引入jq
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    // 清理dist
    new CleanWebpackPlugin(['dist']),
    // 抬头文件声明
    new webpack.BannerPlugin('负责本内容代码者：Rason'),
    // 抽离第三方插件
    new webpack.optimize.CommonsChunkPlugin({
      //name对应入口文件中的名字，我们起的是jQuery
      name: ['jquery'],
      //把文件打包到哪里，是一个路径
      filename: 'js/[name].js',
      //最小打包的文件模块数，这里直接写2就好
      minChunks: 2
    }),
  ],
  // 配置
  module: {
    rules: [
      // 全局暴露jq符号
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: '$'
        }]
      },
      // 加载css
      {
        test: /\.css$/,
        // css分离
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 }},
            'postcss-loader',
          ],
          publicPath: '../',
        })
      },
      // 加载css图片
      {
        test: /\.(png|jpg|gif)/,
        use: [{
          loader: 'url-loader?name=img/[hash:8].[name].[ext]',
          options: {
            // 把小于5000B的文件打成Base64的格式，写入JS
            limit: 5,
            // 图片分离的路径
            outputPath: 'images/',
          }
        }]
      },
      // html图片
      {
        test: /\.(htm|html|ejs)$/i,
        use: ['html-withimg-loader']
      },
      // sass
      {
        test: /\.scss$/,
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
            'sass-loader',
          ],
          publicPath: '../',
        })
      },
      // bable
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/
      }
    ]
  }
};

/**
 * 生产环境：cnpm i --save-dev cross-env
 * 多配置文件：cnpm i --save-dev webpack-merge
 * 本地服务器：cnpm install webpack-dev-server --save-dev
 * （"server": "webpack-dev-server --open"）
 * 加载css：cnpm install style-loader css-loader --save-dev
 * 打包html：cnpm install --save-dev html-webpack-plugin
 * css图片：cnpm install --save-dev file-loader url-loader
 * css分离：cnpm install --save-dev extract-text-webpack-plugin
 * html图片：cnpm install html-withimg-loader --save
 * sass：1，cnpm install --save-dev node-sass 2，cnpm install --save-dev sass-loader
 * css前缀：cnpm install --save-dev postcss-loader autoprefixer
 * （配置文件---postcss.config.js）内容module.exports = {plugins: [require('autoprefixer')]}
 * 消除css：cnpm i -D purifycss-webpack purify-css
 * bable：cnpm install --save-dev babel-core babel-loader babel-preset-env babel-preset-react
 * （配置文件---.babelrc）内容{"presets":["react","env"]}
 * 全局引入jq：cnpm install --save jquery
 * 清理dist文件：cnpm install clean-webpack-plugin --save-dev
 * "dev":"set type=dev&webapck",
 * 代码压缩：cnpm install uglifyjs-webpack-plugin --save-dev
 * 暴露jq： cnpm install expose - loader--save - dev
 */

 /**
  *
    "build:dev": "webpack-dev-server --open --config webpack.dev.js",
    "build:prod": "webpack --progress --config webpack.prod.js"
  */
