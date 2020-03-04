//1、 webpack就是一个模块打包机，他做的事情就是分析你的项目结构，找到js模块以及其他的一些浏览器不能直接运行的拓展语言（Scss，Ts等），并将其打包为合适的格式以供浏览器使用
// webpack是一个模块打包工具，可以识别出引入模块的语法，早期的webpack只是一个js模块的打包工具，现在可以使css，png，vue的模块打包工具
// 通过入口文件分析相互依赖的文件关系进行打包
// 默认模块是js和json的，其他的是需要loader的配置
// import logo from './logo.png'
// import "./index.css";
// import "./index.less";

//2、 file-loader做的事情就是原封不动的将文件移动到dist目录下并返回移动后的地址
/**console.log(logo);
var img = new Image();
img.src = logo;
img.classList.add("logo");
document.getElementById("root").append(img);

document.write("hello webpack000！！2222222！6666！ .........今天是个好日子呀！！！");
console.log("hello");
**/

///3、proxy代理跨域
/*
import axios from "axios";
axios.get("/api/info").then(res=>{
    console.log(res);
})
*/
///4、css模块处理MHR
/**
 var btn = document.createElement("button");
 btn.innerHTML = "新增";
 document.body.appendChild(btn);

 btn.onclick = function(){
     var div = document.createElement("div");
     div.innerHTML = "item";
     document.body.appendChild(div);
 }
 */

// 5、js模块处理MHR
/*
import counter from "./counter"
import number from "./number"
counter();
number();

// 需要通过module.hot来监听js模块
// module.hot可以判断MHR是否开启
if(module.hot){
    module.hot.accept("./number",function(){
        document.body.removeChild(document.getElementById("number"));
        number();
    })
}
*/

// 6、babel处理ES6、ES7
// import "@babel/polyfill"; //es6、es7、es8、es9等新特性都引入进来
/*
const arr = [new Promise(() => {}),new Promise(() => {})];

arr.map(item => {
    console.log(item);
})
*/

// 7、react的配置
import React, { Component } from "react";
import ReactDom from "react-dom";

class App extends Component {
    render(){
        return <div>hello world</div>;
    }
}

ReactDom.render(<App/>,document.getElementById("app"));

















