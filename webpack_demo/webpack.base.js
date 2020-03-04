
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title:"首页",
      template: "./src/index.html",
      inject: true,
      // 将分割split的代码插入到页面中，并且按顺序加载
      chunks: ["vendors~index","index"],
      filename:"index.html"
    }),
    new CleanWebpackPlugin()
  ],
}