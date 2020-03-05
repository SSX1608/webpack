// plugin的基本结构，它是一个类class
// 比较重要的有cleanwebpackplugin, htmlwebpackplugin,作用于webpack的打包周期的某个时机,所以他们都需要钩子，
// 而compiler就是提供各种生命周期钩子的对象
class MyPlugin {
    constructor(options) {
        // 通过参数options接收plugin传递的参数
        this.options = options;
    }
    // compiler是webpack实例
    apply(compiler) {
        // 在输出目录放入一个文件，emit是在写入dist之前触发
        compiler.hooks.emit.tapAsync("MyPlugin",(complition,cb)=>{
            // compilation是本次打包构建过程对象
            complition.assets['putFile.txt'] = {
                source:()=>{
                    return "输入文本内容";
                },
                size:()=>{
                    return 1024;
                }
            }
            // cb回调继续往下一步走,通知上一步完成了，可以进入下一步了
            cb();
        })
        compiler.hooks.compile.tap("MyPlugin",(complition)=>{
            console.log("同步钩子");
        })
    }
}

module.exports = MyPlugin;