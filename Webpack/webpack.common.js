const path = require('path');
const webpack = require('webpack');

const fs = require('fs');

// 生成html
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理dist
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 分离css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 消除css
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');
// 全局资源搬运
const copyWebpackPlugin = require("copy-webpack-plugin");


// 文件夹信息
function readFileList(thePath, filesList) {
  let files = fs.readdirSync(thePath); // 返回一个包含“指定目录下所有文件名称”的数组对象
  files.forEach(function (itm, index) {
    let stat = fs.statSync(thePath + itm); // 获取文件或者文件夹信息
    if (stat.isDirectory()) { // 是否是文件夹
      //递归读取文件
      readFileList(thePath + itm + "/", filesList)
    } else {
      let data = path.parse(thePath + itm)
      filesList[data.name] = thePath + itm
    }

  })
}

// 获取文件列表
function getFileList(thePath) {
  let filesList = {};
  readFileList(thePath, filesList);
  return filesList;
}

// 动态入口
// let theEntry = JSON.stringify(getFileList('./src/js/'));
let theEntry = getFileList('./src/js/');

let config = {
  // 入口
  // entry: {
  //   app: './src/js/index.js',
  // },
  entry: theEntry,
  // 出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  // 提取js common 可改名字
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 注意: priority属性
        // 其次: 打包业务中公共代码
        // common: {
        //   name: "common",
        //   chunks: "all",
        //   minSize: 1,
        //   priority: 0
        // },
        // 首先: 打包node_modules中的文件
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 10
        }
      }
    }
  },
  // 插件
  plugins: [
    // 清理dist
    new CleanWebpackPlugin(['dist']),
    // 生成html
    // new HtmlWebpackPlugin({
    //   // 通过 <%= htmlWebpackPlugin.options.title %> 传递参数到html显示
    //   // title: 'test',
    //   // 模版路径
    //   template: './src/page/index.html',
    //   chunks: ['index', 'vendor']
    // }),
    // 分离css
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      // chunkFilename: "css/[id].css"
    }),
    // css消除
    new PurifyCSSPlugin({
      // paths: glob.sync(path.join(__dirname, 'src/page/*.html')),
      paths: glob.sync(path.join(__dirname, 'src/page/*.html')),
    }),
    // 全局暴露
    new webpack.ProvidePlugin({
      $: "jquery"
    }),
    // 全局资源搬运
    new copyWebpackPlugin([{
      from: './src/assets',
      to: './assets'
    }]),

  ],
  // 配置
  module: {
    rules: [
      // css
      {
        test: /\.css$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          "css-loader",
          "postcss-loader"
        ]
      },
      // 图片
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            limit: 5, // 表示小于xxb图片转为base64,大于xxb的是路径
            outputPath: 'images' //定义输出的图片文件夹
          }
        }]
      },
      // html
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true,
            removeComments: false,
            collapseWhitespace: false
          }
        }],
      },
      // sass
      {
        test: /\.(sass|scss)$/,
        use: [
          // 分离sass
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../"
            }
          },
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      // babel
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
};

let theHtml = getFileList('./src/page/')

for (let key in theHtml) {
  let theFileName = ''
  if(key == 'index'){
    theFileName = './' + key + '.html'
  }else {
    theFileName = './page/' + key + '.html'
  }
  var conf = {
    filename: theFileName, //生成的html存放路径，相对于path
    template: 'src/page/' + key + '.html', //html模板路径
    inject: false, //js插入的位置，true/'head'/'body'/false
    minify: {
      // 清除html注释
      removeComments: true,
      // 压缩html
      collapseWhitespace: true,
      // 是否去掉属性的双引号
      removeAttributeQuotes: true,
      // 省略布尔属性的值 <input checked="true"/> ==> <input />
      collapseBooleanAttributes: true,
      // 删除所有空格作属性值 <input id="" /> ==> <input />
      removeEmptyAttributes: true,
      // 删除<script>的type="text/javascript"
      removeScriptTypeAttributes: true,
      // 删除<style>和<link>的type="text/css"
      removeStyleLinkTypeAttributes: true,
    },
    /*
     * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
     * 如在html标签属性上使用{{...}}表达式，所以很多情况下并不需要在此配置压缩项，
     * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
     * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
     */
    // minify: { //压缩HTML文件
    //  removeComments: true, //移除HTML中的注释
    //  collapseWhitespace: false //删除空白符与换行符
    // }
  };
  if (key in config.entry) {
    conf.inject = 'body';
    conf.chunks = [key, 'vendor'];
    conf.hash = true;
  }
  config.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = config