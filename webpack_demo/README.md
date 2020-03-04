一、基本配置操作
1、命令行创建目录 mkdir packageName,打开编辑器命令 code .
2、初始化一个包 npm init -y
3、安装webpack 推荐局部安装，在4.0以后webpack和webpack-cli分离了，所以都要安装
    npm install webpack webpack-cli -D
4、查看局部安装的版本信息 npx webpack -v
    或者进入webpack的目录 ./node_modules/.bin/webpack -v
5、安装指定版本的 npm install webpack@x.xx webpack-cli -D
6、启动 npx webpack
    默认入口文件是src/index.js, 默认输出文件dist/main.js
7、配置文件webpack.config.js
    执行npx webpack时，会查看是否有webpack.config.js，有则走给文件，无则走默认配置
    还可以自定义配置文件名称，需要启动时指定npx webpack --config webpack.test.js
8、命令行启动简化
    借助node安装的模块会在node_modules/bin下面生成一个软连接，来配置自定义的功能命令
    在package.json里面的scripts里面配置命令
二、webpack核心概念
    webpack的工作流程，通过入口文件，分析依赖关系，把依赖的文件通过loader加载以及plugins处理，最终输出js、css、png等模块文件
1、entry
    指定打包入口文件，webpack执行构建的第一步将从entry开始，可抽象成输入
    a、单入口 SPA，本质是一个字符串
        entry:{
            main:'./src/index.js'
        }
        相当于
        entry:'./src/index.js'
    b、多入口配置 entry是一个对象
        entry:{
            index:'./src/index.js',
            login:'./src/index.js'
        }

2、output
    指定打包输出路径和文件
    output:{
        path: path.resolve(__dirname,"./dist"),
        filename:"main.js"
    }
    a、其中path是打包输出路径，必须使用绝对路径；
    b、filename是打包文件名称，而filename是可以是用[]占位符来配置的；
    filename:"[name].js"此时打包输出文件引用entry入口文件的名字作为输出文件名字，可以用于多入口文件的输出
    还可以给输出文件添加哈希值以清除缓存,做版本管理，filename:"[name]_[chunkhash:8].js"，只有chunk文件里面发生了变化，那么chunkhash就会变化，形成不同版本；比如多入口的index变化，而login没变化，那么只有index的chunkhash会变化，而login的还是原来的继续使用浏览器缓存，进而做性能优化

3、mode
    用来指定当前的构建环境，有三个值production、development、none；
    设置mode可以自定触发webpack内置的函数，达到优化的效果
    mode会根据不同的配置开启内置的一些功能插件做优化，比如生产环境的一些代码分离、压缩、提取公共等插件功能，开发环境的热更新等功能插件
    a、值development：会将DefinePlugin中的process.env.NODE_ENV的值设置为development。
       启用NamedChunksPlugin和NamedModulesPlugin。热更新识别变化的文件
    b、值production：会将DefinePlugin中的process.env.NODE_ENV的值设置为production。
       启用FlagDependencyUsagePlugin、FlagIncludedChunksPlugin、ModuleConcatenationPlugin、
       NoEmitOnErrorsPlugin、OccurenceOrderPlugin、SideEffectsFlagPlugin和TerserPlugin。
       内置压缩，摇树去掉副作用代码，代码分割
    c、值none：退出任何默认优化选项

    如果不设置，默认是production，注意：设置NODE_ENV并不会自动设置mode。
    开发阶段的开启会有利于热更新的处理，识别哪些模块变化了
    生产阶段的开启会有利于模块压缩，处理副作用等一些功能

4、module
   模块，在webpack里一切皆模块，一个模块对应着一个文件。webpack会从配置的entry开始递归找出所有依赖的模块。
   当webpack处理到不认识的模块时，需要在webpack中的module处进行配置，当检测到是什么格式的模块，就使用什么loader来处理。
   module: {
    rules: [
      {
        //指定匹配规则
        test: /\.css$/,
        //指定使用的loader
        use: "style-loader"
      }
    ]
   }
   
    所谓loader是：
        模块解析，模块转换器，用于把模块原内容按照需求转换成新内容。
        webpack是模块打包工具，而模块不仅仅是js，还可以是css，图片或者其他格式
        但是webpack默认只知道如何处理js和JSON模块，那么其他格式的模块处理和处理方式就需要loader了
    常见的loader：
        style-loader、css-loader、less-loader、sass-loader、ts-loader、babel-loader、file-loader、
        eslint-loader等

   loader汇总：
   1）file-loader：处理静态资源模块
      原理：是把打包入口中识别出来的资源模块，移动到输出目录，并返回一个地址名称
      使用场景：当我们需要模块仅仅是从源代码移动到打包目录时，就可以使用file-loader处理
      {
        test: /\.png|jpe?g|gif$/, //格式支持多个
        // use使用一个loader可以用对象，字符串，两个loader需要用数组
        // use: "file-loader",
        use:{
          loader: "file-loader",
          // options额外的配置，比如资源名称
          options: {
            // placeholder占位符，[name]老资源模块的名称，[ext]老资源模块的后缀
            // https://webpack.js.org/loaders/file-loader#placeholders
            name: "[name]_[hash].[ext]",
            // 打包后的存放位置
            outputPath: "images/",
            publicPath: "../images"
          }
        }
      }

    2）url-loader:它内部使用了file-loader，所以可以处理file-loader所有的事情，但是遇到jpg格式的模块，会把该图片转换成base64格式字符串，并打包到js中。对于小体积的图片比较合适，大图片不合适。
    可以是用url-loader代替file-loader，可以设置limit选项，配置图标的大小限制，小于限制会打成base64到js，适合小图片、图标和字体等，以减少图片的请求次数
    {
        test: /\.png|jpe?g|gif$/, 
        use:{
          loader: "url-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
            // 图片小于2048b才转换成base64
            limit: 2048
          }
        }
    }

    3）文件监听
       轮询判断文件的最后编辑时间是否变化，某个文件发生了变化，并不会立即告诉监听者，先缓存起来,即发现有文件变化就是执行一次打包处理，当文件配置自动插入功能和浏览器自动刷新功能之后就能实现了热更新
       webpack开启监听模式有两种方式
       a、启动webpack命令时带上 --watch 参数，启动监听后需要手动刷新浏览器
          scripts:{
              "watch":"webpack --watch"
          }
        
        b、在配置文件里设置watch:true
           watch:true, //设置false不开启
           //配合watch，只有开启才有用
           watchOptions:{
               //默认为空，不监听的文件或目录，支持正则
               ignored:/node_modules/,
               //监听文件变化后，等300ms再去执行，默认300ms
               aggregateTimeout:300,
               //判断文件是否发生变化是通过不停的询问系统指定文件有没有变化，默认每秒1000次
               poll:1000
           }

    4）css-loader和style-loader
       css-loader分析css模块之间的关系，并合成一个css
       style-loader会把css-loader生成的内容，以style挂载到页面的head部分
       {
        test: /\.css$/,
        // loader是有执行顺序的，从右到左
        use: ["style-loader","css-loader"]
       }
       注意：loader执行是有顺序的，是从右到左执行，先合并css再挂载到head，所以上面的顺序不能变
    
    5）less-loader：把less语法转换成css语法
       {
        test: /\.less$/,
        // loader是有执行顺序的，从右到左,从上到下
        use: ["style-loader","css-loader","less-loader"]
       }
       注意：使用less-loader时不只需要安装less-loader还需要安装less

    6) postcss-loader: 样式自动添加前缀
       需要安装postcss-loader，和autoprefixer
       //需要设置插件配置，所以使用对象形式
       {
        loader:"postcss-loader",
        options:{
            // plugins返回的是一个数组
            plugins:()=>[
            require("autoprefixer")({
                // autoprefixer新版本中browsers替换成overrideBrowserlist
                // browsers:["last 2 version",">1%"],
                overrideBrowserslist:["last 2 version",">1%"]
            })
            ]
        }
       }
       注意：插件配置项plugins是个函数，该函数返回一个数组
       此外，也可以把插件配置项options写到postcss的配置文件中（跟路径下的postcss.config.js）,这样webpack中的配置就可以简化了，只需要写上postcss-loader即可

       postcss.config.js里面这么写，plugins直接是个数组：
       module.exports = {
        plugins:[
            require("autoprefixer")({
            // autoprefixer新版本中browsers替换成overrideBrowserlist
            // browsers:["last 2 version",">1%"],
            overrideBrowserslist:["last 2 version",">1%"]
            })
        ]
    }

5、plugins
   plugins可以在webpack运行到某个阶段的时候，帮你最一些事情，类似于生命周期的概念；扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想做的事情；作用于整个构建过程。
   常用插件：
   1）html-webpack-plugin
      html-webpack-plugin会在打包结束后，自动生成一个html文件，并把生成的js模块引入到该html中。
      plugins: [
        new HtmlWebpackPlugin({
            title:"",
            filename:""
        })
      ]
      配置参数：
        title:用来生成页面的title元素,html模板中只支持ejs的语法。
        filename：输出的HTML文件名，默认是index.html，也可以直接配置带有子目录。
        template：指定模板文件路径（即使用哪个作为输出），支持加载器，比如html!./index.html。
        inject：true | 'head' | 'body' | false ,注入所有的资源到特定的template或者templateContent中，
            如果设置为true或者body，所有的JavaScript资源将被放置到body元素的底部，设置'head'则将放置到head元素中。
        favicon：添加特定的favicon路径到输出的HTML文件中。
        minify：{} | false ,传递html-minifier选项给minify输出
        hash：true | fasle ,如果为true，将添加一个唯一的webpack编译hash到所有包含的脚本和css文件，
            对于解除cache很有用。
        cache：true | false ,如果为true(默认值)，仅仅在文件修改之后发布文件。
        showErrors: true | false ,如果为true(默认值)，错误信息会写入到HTML页面中。
        chunks: 允许只添加某些块（比如，仅仅unit test块）。
        chunksSortMode：允许控制块在添加到页面之前的排序方式，
            支持的值：none | default | {function}-default:'auto'
        excludeChunks: 允许跳过某些块（比如，跳过单元测试块）。

    2）clean-webpack-plugin
       每次打包之前，自动删除webpack里的dist目录。
    
    3）mini-css-extract-plugin
       将CSS提取为独立的文件的插件，对每个包含css的js文件都会创建一个CSS文件，支持按需加载css和sourceMap.
       使用此插件后，在处理css或者less时就不能用style-loader了，需要用：
       const MiniCssExtractPlugin = require("mini-css-extract-plugin")
       MiniCssExtractPlugin.loader,来处理成一个独立的文件

       hash是webpack构建的hash版本，构建一次变一次
       chunkhash是入口模块的变化才会引起hash的变化（js使用，入口文件）
       contenthash是当前文件内容变化才会变化（css使用）
       配置参数：
        //此处使用contenthash，是取决于css文件的变化hash才会变化
        filename:"[name]_[contenthash:8].css"

    4）sourceMap
       源代码与打包后的代码的映射关系，通过sourceMap定位到源代码。
       即生成一个.map文件,在源代码与打包后的文件对应，便于在使用打包文件时调试源代码。
       在dev模式中，默认开启，关闭的话可以在配置文件中配置devtool:"none"
       devtool的介绍：https://webpack.js.org/configuration/devtool#devtool
       eval:速度最快，使用eval包裹模块代码，
       source-map:产生.map文件
       cheap：较快，不包含列信息
       Module：第三方模块，包含loader的sourcemap（比如jsx to js，babel的sourcemap）
       inline-source-map：将.map作为DataURI引入，不单独生成.map文件
       配置推荐：
            devtool:"cheap-module-eval-source-map", //开发环境配置
            devtool:"cheap-module-source-map", //线上生成配置，一般不推荐开启
    5）webpackdevserver
       提升开发效率的利器,他会开启一个服务器，并监听资源的变化，进行打包和刷新浏览器
       每次改完代码都需要重新打包一次，打开浏览器，刷新一次，很麻烦
       我们可以安装使用webpackdevserver来改善这块的体验

       启动服务后，会发现dist目录没有了，这是因为devServer把打包后的模块不会放到dist目录下，而是放到内存中，从而提升速度

       package.js配置：
         "scripts": {
             "server" : "webpack-dev-server"
       }

       在webpack.config.js配置：
       devServer: {
            //服务器开启的地址，并且open也会默认打开浏览器当前地址中的index.html
            contentBase: "./dist",
            open: true,
            port: "8081"
       }

       跨域：devServer里面配置一下代理
            proxy: {
                "/api": {
                    target: "http://localhost:9092"
                }
            }
            联调期间，前后端分离，直接获取数据会跨域，上线后我们使用Nginx转发，开发期间，webpack就可以搞定跨域了
            启动一个服务器，mock一个接口：

            //创建一个server.js，修改scripts "server":"node server.js"
            const express = require("express");
            const app = express();
            app.get("/api/info",(req,res) => {
                res.json({
                    name:"mock接口",
                    age:"18",
                    msg:"欢迎你哎呀！！！"
                })
            })

            app.listen("9092");

    6）Hot Module Replacement(HMR：热模块替换)
       即是局部刷新，而不是刷新整个浏览器
       启动hmr
       devServer: {
            contentBase: "./dist",
            open: true,
            port: "8081",
            hot: true,
            //基本HMR不生效，浏览器也不自动刷新，就开启hotOnly
            hotOnly: true
       }

       配置文件引入webpack，因为HMR是webpack自带的一个功能插件，所以要在插件中使用
       new webpack.HotModuleReplacementPlugin()
       并devServer中配置hotOnly: true

       a、处理css模块的HMR
          注意：启动HMR后，css抽离成单独文件会不生效（css的处理不能用MiniCssExtractPlugin插件了，必须用style-loader才会生效），还有HMR不支持contenthash，chunkhash
       b、处理js模块的HMR
          参考文档：https://www.webpackjs.com/guides/hot-module-replacement/
            // 需要通过module.hot来监听js模块的变化，触发回调函数做操作
            // module.hot可以判断MHR是否开启
            if(module.hot){
                module.hot.accept("./number",function(){
                    document.body.removeChild(document.getElementById("number"));
                    number();
                })
            }
    7）分生产和开发配置
       方案1、创建三个配置文件：
            webpack.base.js配置基础配置
            webpack.dev.js配置开发配置
            webpack.pro.js配置生产配置
            最后，在dev和pro的配置文件里面，使用webpack-merge将base进行合并，
            并在package.json里面的scripts里面配置相应的启动命令  

        方案2、基于环境变量配置
            //外部传入的全局变量
            module.exports = (env) => {
                if(env && env.production){
                    return merge(commonConfig,prodConfig)
                }else{
                    return merge(commonConfig,devConfig)
                }
            }
            //外部传入变量
            scripts:  "--env.production"

    8）babel处理ES6、ES7
       npm i babel-loader @babel/core @babel/preset-env -D

       babel-loader是webpack与babel的通信桥梁，不会做把es6转换es5的工作，这部分工作需要用到@babel/preset-env来做

       a、@babel/preset-env：
          它里包含了es6转es5的转换规则，转换到目标的规则，指定es5，指定浏览器
       
       module里面添加
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:"babel-loader",
                    options: {
                        //指定规则
                        presets: ["@babel/preset-env"]
                    }
                }
            }

        b、@babel/polyfill:    
        通过以上几步还不够，Promise等一些还没转换过来，这时候需要借助@babel/polyfill，把es的新特性都装进来，来弥补低版本浏览器中缺失的特性
        import "@babel/polyfill"; //es6、es7、es8、es9等新特性都打包进来，
        这时就需要按需打包新特性了：
            use:{
                loader:"babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                            targets:{
                                edge:"17",
                                firefox:"60",
                                chrome:"67",
                                safari:"11.1"
                            },
                            useBuiltIns:"usage" //按需注入
                            }
                        ]
                    ]
                }
            }
        useBuiltIns选项是babel 7的新功能，这个选项告诉babel如何配置@babel/ployfill.
        它有三个参数：
            a、entry：需要再webpack的入口文件中import "@babel/polyfill"一次。
               babel会根据你的使用情况导入垫片，没有使用的功能不会导入相应的垫片。
            b、usage：不需要import，自动检测，但是要安装@babel/polyfill。（实验阶段）
            c、false：如果你import "@babel/polyfill",它不会排除没有使用的垫片，程序体积会庞大（不推荐）
            以全局变量的方式注入进来的，windows.Promise,他会造成全局对象的污染
        请注意：usage的执行类似于babel-transform-runtime,不会造成全局污染，因此也不会对类似Array.prototype.includes()进行polyfill。

        此外，关于babel的配置options可以单独抽离出来，放到根目录的.babelrc文件里面；
        .babelrc就是babel的配置文件，webpack首先会查找根目录下有没有这个文件

        c、@babel/plugin-transform-runtime:
           当我们开发的是组件库、工具库这些场景的时候，polyfill就不合适了(用于开发项目)，因为polyfill是注入到全局变量，window下的，会污染全局，所以推荐使用闭包方式：@babel/plugin-transform-runtime
           使用注意：polyfill是通过参数presets配置的，runtime是用过插件plugins配置的

    9）配置React打包环境
       安装：npm install react react-dom --save
       安装babel与react语法转换的插件：npm install --save-dev @babel/preset-react
       可以处理jsx等react语法

       在.babelrc里面配置 "presets": ["@babel/preset-react"]
       对于jsx和tsx使用loader格式处理：test:/\.jsx?$/
    
    10）tree shaking:
        webpack2.x开始支持tree shaking概念，顾名思义，“摇树”，只支持ES module的引入文件的方式！！！！！
        把代码当中没有用到的部分，只打包用到的代码。

        //webpack.config.js
        optimization:{
            usedExports:true
        }

        //package.json
        注意：如果开启了tree shaking，那么通过import "./*.css"引入的css也会被摇掉，需要一下配置避免副作用
        在package.json配置：
        "sideEffect":false(默认不开启) 正常对所有模块进行tree shaking或者“sideEffect”
        "sideEffects":[
            "*.css"
        ]
        ['*.css','@babel/polyfill']
        并且开发模式下，是不会把没用的代码摇掉的

    11）代码分割 code splitting
        将一些三方公共库剥离出单独的文件模块，因为业务代码要经常变动，公共库不会。
        并且会自动将其引入到页面中。如果都放一块则体积大，加载时间长
        其实code splitting概念与webpack并没有直接的关系，只不过webpack中提供了一种更加方便的方法提供我们实现代码分割，基于https://webpack.js.org/plugins/split-chunks-plugin/
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
        chunks有三个值：async分割异步代码 | initial分割同步代码 | all分割所有代码

        plugins: [
            new HtmlWebpackPlugin({
            title:"首页",
            template: "./src/index.html",
            inject: true,
            // 将分割split的代码插入到页面中
            chunks: ["vendors~index","index"],
            filename:"index.html"
            }),
            new CleanWebpackPlugin()
        ],











































