const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const merge = require("webpack-merge");

const baseConfig = require("./webpack.base");

const proConfig = {
  output: {
    path: path.resolve(__dirname,"./dist"),
    filename: "[name]_[chunkhash:8].js"
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
          MiniCssExtractPlugin.loader,
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
      }
    ]
  },
  mode: "production",
  devtool:"none",
  plugins:[
    new MiniCssExtractPlugin({
      filename:"[name]_[contenthash:8].css"
    })
  ],
  // 只能在生产模式中看到效果，开发模式中不生效
  optimization:{
    usedExports:true
  },
}

module.exports = merge(baseConfig,proConfig);