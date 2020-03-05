const path = require("path");
const MyPlugin = require("./MyPlugins/webpack_plugin");

module.exports = {
    entry:"./src/index.js",
    mode:"development",
    output:{
        path:path.resolve(__dirname,"./dist"),
        filename:"main.js"
    },
    // 处理自定义loader的路径问题，不用再手动写绝对路径了,指定loader的查找路径
    resolveLoader:{
        modules: ["node_modules","./MyLoader"]
    },
    /*
    module:{
        rules:[
            {
                test: /\.js$/,
                use: [
                    // 多个loader有加载顺序，从右到左，从上到下
                    // path.resolve(__dirname,"./MyLoader/loader_another.js"),
                    "loader_another",
                    {
                        // loader:path.resolve(__dirname,"./MyLoader/loader_my.js"),
                        loader:"loader_my",
                        options:{
                            name:"loader_my"
                        }
                    }
                ]
            }
        ]
    },
    */
    plugins:[
        new MyPlugin({
            name:"webpackLove"
        })
    ],
}