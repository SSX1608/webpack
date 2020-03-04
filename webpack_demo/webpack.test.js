const path = require("path");
module.exports = {
  entry:"./src/index.js",
  output:{
    // 必须是绝对路径,使用node的path模块做路径解析
    // 拿到当前的路径__dirname做一个路径拼接
    path: path.resolve(__dirname,"./dist"),
    filename:"main.js"
  },
  // 生产模式，打包输出的文件是压缩的
  mode:"production"
}