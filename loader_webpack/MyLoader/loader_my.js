//loader基本结构

const utils = require("loader-utils");
module.exports = function(source){
    //1、 不能为箭头函数,因为需要this的正确指向webpack
    let sourceFile = source;
    let newSource = sourceFile.replace("webpack_loader","my_loader");
    //2、第一个loader返回的函数会接收源文件
    // console.log(sourceFile);
    //3、 this.query是当前loader配置的options对象，
    // 如果loader没有options而是以query字符串为参数调用，则this.query是一个查询字符串
    console.log(this.query);
    // 官方推荐使用utils模块的getOptins方法获取参数
    const options = utils.getOptions(this);
    console.log(options.name);
    //4、this.callback一个可以同步或异步调用的可以返回多个结果的函数
    //5、此函数必须返回一个string或者buffer
    // return newSource;

    // 6、异步处理
    // 定义一个异步处理，告诉webpack，这个loader里面有异步事件，在里面调用下这个异步
    // callback就是this.callback
    const callback = this.async();
    setTimeout(() => {
        const result = source.replace("webpack_loader",options.name);
        return callback(null,result);
    },3000)
}