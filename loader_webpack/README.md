一、手动编写一个Loader
所谓loader只是一个导出为函数的js模块，loader runer会调用这个函数，然后把上一个loader产生的结果或者源文件传入进去，函数的this上下文将由webpack填充，并且loader runner具有一些有用的方法可以使loader改变为异步调用方式，或者获取query参数。
第一个loader会接收源文件
自己编写一个loader的过程比较简单，loader就是一个函数，声明式函数，不能使用箭头函数
拿到源代码做进一步的修饰处理，再返回处理后的源码就可以了
参考资料：https://webpack.js.org/contribute/writing-a-loader/
         https://webpack.js.org/api/loaders/

1、loader基本结构，是使用module.expots=function(source){}导出一个函数，第一个loader返回的函数会接收源文件，
   并且此函数必须有返回值，返回一个string或者buffer
2、导出函数不能为箭头函数,因为需要this的正确指向webpack
3、this.query是当前loader配置的options对象，如果loader没有options而是以query字符串为参数调用，
   则this.query是一个查询字符串。
   而官方推荐使用utils模块的getOptins方法获取参数
    const options = utils.getOptions(this);
    console.log(options.name);
4、this.callback一个可以同步或异步调用的可以返回多个结果的函数，期望参数为
   this.callback(
        err: Error | null,
        content: string | Buffer,
        sourceMap?: SourceMap,
        meta?: any
    );
6、异步处理
   定义一个异步处理，告诉webpack，这个loader里面有异步事件，在异步操作里面里面调用下这个异步
   const callback = this.async();
   setTimeout(()=>{
       return callback(null,result);
   },1000)
   其中，callback就是this.callback
7、多个loader使用
   多个loader有加载顺序，从右到左，从上到下
8、处理自定义loader的路径问题，不用再手动写绝对路径了,指定loader的查找路径
   使用自定义loader有两个方式：
      1）使用path的resolve处理绝对路径
         loader:path.resolve(__dirname,"./MyLoader/loader_another.js")
      2）使用webpack的配置项reolveLoader来处理自定义loader的路径问题，不用再手动写绝对路径了,指定loader的查找路径，使用loader就可以直接写文件名称,他会到node_modules路径找，找不到则去./My-loader路径找
      reolveLoader:{
        modules: ["node_modules","./MyLoader"]
      },
      loader:"loader_another"
9、loader是处理入口文件以及入口文件所依赖的所有的模块代码

二、手动编写plugins
    plugin是在开始打包的某时刻，帮助我们处理一些操作的机制。
    plugin在webpack中占有很大的使用场景，它是webpack的支柱
    它使用了事件驱动和发布订阅的设计模式，plugin是一个类，里面包含一个apply函数，接收一个参数complier
    参考资料:https://webpack.js.org/contribute/writing-a-plugin/
1、plugin的基本结构，它是一个类class
    class MyPlugin {
        constructor(options) {
            //通过参数options接收plugin传递的参数
        }
        //compiler是webpack实例
        apply(compiler) {
            console.log("go start");
        }
    }
    module.exports = MyPlugin;
2、plugin本质
   比较重要的有cleanwebpackplugin, htmlwebpackplugin,作用于webpack的打包周期的某个时机,所以他们都需要钩子，
   而apply方法中的参数compiler就是提供各种生命周期钩子的对象，钩子分为sync和async钩子。
   compilation是本次打包构建过程对象；
   compiler是webpack的支柱引擎，它通过CLI或者Node API传递的所有选项，创建出一个compilation实例。它扩展自Tapable类，以便注册和调用插件。

 