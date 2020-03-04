const path = require("path");
const webpack = require("webpack");
// 合并base配置和开发配置
const merge = require("webpack-merge");

const baseConfig = require("./webpack.base");

const devConfig = {
  mode: "development",
  output: {
    path: path.resolve(__dirname,"./dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.png|jpe?g|gif$/, 
        use:{
          loader: "url-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
            limit: 2048
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader","css-loader"]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader",
          "postcss-loader"
        ]
      },
      {
        test:/\.(woff2|woff)$/,
        use:{
          loader:"file-loader"
        }
      },
      {
        test:/\.jsx?$/, //兼容js和jsx
        exclude:/node_modules/,
        use:{
          loader:"babel-loader",
          // options: {
          //   presets: [
          //     [
          //       "@babel/preset-env",
          //       //兼容最低版本
          //       {
          //         targets:{
          //           edge:"17",
          //           firefox:"60",
          //           chrome:"67",
          //           safari:"11.1"
          //         },
          //         useBuiltIns:"usage" //按需注入
          //       }
          //     ]
          //   ]
          // }
        }
      }
    ]
  },
  devtool:"cheap-module-eval-source-map",
  devServer: {
    port: "8081",
    contentBase: "./dist",
    open: true,
    hotOnly: true,
    proxy: {
      "/api": {
        target: "http://localhost:9092"
      }
    }
  },
  // tree shaking
  optimization:{
    usedExports:true,
    // 自动做代码分割
    splitChunks:{
      chunks:"all", //默认支持异步，我们使用all
      minSize: 3000, //模块大于才会分割出来
      minChunks: 2, //模块被引用两次才会分割出来
      automaticNameDelimiter:"-", //vendors与index的分隔符
      name:true, //打包后的名称，除了布尔，还可以是一个函数
      cacheGroups:{ //缓存组,即是按组分离
          commons: {
              test:/(react|react-dom)/,
              name:"react_vendors",
              chunks:"all"
          }
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = merge(baseConfig,devConfig);