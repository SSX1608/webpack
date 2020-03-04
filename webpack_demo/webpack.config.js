const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = {
  // 指定打包入口文件，webpack构建的第一步就是从entry开始的
  // entry: "./src/index.js",
  entry: {
    index: "./src/index.js",
    login: "./src/login.js"
  },
  // 打包输出文件
  output: {
    // 必须是绝对路径,使用node的path模块做路径解析
    // 拿到当前的路径__dirname做一个路径拼接，path.resolve就是做路径拼接的，还有一个path.join
    path: path.resolve(__dirname,"./dist"),
    // 是用chunk name占位符，js模块就用chunkhash指的就是入口的chunk
    // filename: "[name]_[chunkhash:8].js",
    filename: "[name].js"
  },
  // 配置模式,打包环境，默认是生产模式
  mode: "development",
  // loader模块处理，即webpack不能识别的模块的处理
  module: {
    rules: [
      {
        test: /\.png|jpe?g|gif$/, //格式支持多个
        // use使用一个loader可以用对象，字符串，两个loader需要用数组
        // use: "file-loader",
        use:{
          loader: "url-loader",
          // options额外的配置，比如资源名称
          options: {
            // placeholder占位符，[name]老资源模块的名称，[ext]老资源模块的后缀
            // https://webpack.js.org/loaders/file-loader#placeholders
            name: "[name]_[hash].[ext]",
            // 打包后的存放位置,dist下的images目录
            outputPath: "images/",
            // publicPath: "../images",
            // 图片小于2048b才转换成base64
            limit: 2048
          }
        }
      },
      {
        test: /\.css$/,
        // loader是有执行顺序的，从右到左，先执行css-loader将css合并成一个文件（或一段css），
        // 然后再执行style-loader将生成的css文件插入到引入的html中，在head里面创建个style标签，放进去处理过的css
        use: ["style-loader","css-loader"]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          // 此处就不用style-loader了
          // MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          "postcss-loader",
          // postcss-loader需要设置参数，所以用对象的形式
          // {
          //   loader:"postcss-loader",
          //   options:{
          //     // plugins返回的是一个数组
          //     plugins:()=>[
          //       require("autoprefixer")({
          //         // autoprefixer新版本中browsers替换成overrideBrowserlist
          //         // browsers:["last 2 version",">1%"],
          //         overrideBrowserslist:["last 2 version",">1%"]
          //       })
          //     ]
          //   }
          // }
        ]
      },
      {
        test:/\.(woff2|woff)$/,
        use:{
          // 使用url-loader也可以
          loader:"file-loader"
        }
      }
    ]
  },
  // 插件配置
  // 多入口配置两个
  plugins: [
    new HtmlWebpackPlugin({
      title:"首页",
      template: "./src/index.html",
      inject: true,
      // 加载的js块
      chunks: ["index"],
      // 输出模板文件名称
      filename:"index.html"
    }),
    new HtmlWebpackPlugin({
      title:"注册",
      template: "./src/index.html",
      inject: true,
      chunks: ["login"],
      filename:"login.html"
    }),
    new CleanWebpackPlugin(),
    // new MiniCssExtractPlugin({
    //   // 此处使用contenthash，即引用的css/less内容不变，则生成的文件的hash就不会变
    //   // 只有css/less变化，才会生成一个新的hash版本
    //   filename:"[name]_[contenthash:8].css"
    // }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool:"inline-source-map",
  devServer: {
    // 服务器访问入口路径，默认dist目录
    contentBase: "./dist",
    open: true,
    port: "8081",
    // 配置跨域代理
    proxy: {
      "/api": {
        target: "http://localhost:9092"
      }
    },
    // hot:true,
    // 不让浏览器自动刷新
    hotOnly: true
  }

  // 监听变化
  // watch:true, //设置false不开启
  // //配合watch，只有开启才有用
  // watchOptions:{
  //     //默认为空，不监听的文件或目录，支持正则
  //     ignored:/node_modules/,
  //     //监听文件变化后，等300ms再去执行，默认300ms
  //     aggregateTimeout:300,
  //     //判断文件是否发生变化是通过不停的询问系统指定文件有没有变化，默认每秒检查1次
  //     poll:1000
  // }
}