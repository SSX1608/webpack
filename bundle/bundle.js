// 找到入口文件，分析内容，有依赖则找到依赖路径（入口文件中）,转换代码（浏览器识别的）
// 借助@babel/parser将文件对象描述成一个抽象语法树,找到依赖节点，解析出依赖路径
// 提取路径要使用babel的一个模块@babel/traverse来处理,使用它的default方法,他接收一个抽象语法树
const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const path = require("path");
// transformFromAst将抽象语法树转换成对应的js代码
const { transformFromAst } = require("@babel/core");

const entry = entryFile => {
    const content = fs.readFileSync(entryFile,"utf-8");
    const ast = parser.parse(content,{
        // 配置使用的是哪一种js模块（这里是es6的模块）
        sourceType:"module"
    })

    const dependecies = {};
    traverse(ast,{
        //做个配置，想拿到什么,使用对应的节点类型作为函数来写,接收对应节点为参数
        // 从参数对象中解析出node,ImportDeclaration函数是以当前的Node节点对象为参数的
        ImportDeclaration({ node }){
            const dirname = path.dirname(entryFile);
            // 在windows系统上不识别，需要用反斜杠替换掉,os系统不用转换
            const newPath = "./"+path.join(dirname,node.source.value).replace('\\', '/');
            dependecies[node.source.value] = newPath;
        }
    })

    // 转换代码借助于@babel/core @babel/preset-env(核心库和语法转换规则)
    const { code } = transformFromAst(ast,null,{
        // 设置转换规则
        presets: ["@babel/preset-env"]
    })
    // 返回解析出来的内容
    return {
        entryFile,
        dependecies,
        code
    }

}

// 分析出所有依赖(不只是入口文件中的依赖)
const Dependecies = entryFile => {
    const info = entry(entryFile);
    const modules = [];
    modules.push(info);

    for(let i = 0;i<modules.length;i++){
        const item = modules[i];
        const { dependecies } = item;
        if(dependecies){
            for (let j in dependecies) {
                // 尾递归entry，将二级依赖作为入口进行解析自己的依赖
                modules.push(entry(dependecies[j]));
            }
        }
    }

    const obj = {};
    modules.forEach((item)=>{
        obj[item.entryFile] = {
            dependecies : item.dependecies,
            code : item.code
        }
    });
    console.log(obj);
    return obj;
};

// 生成代码
const genCode = (entryFile) => {
    const obj = Dependecies(entryFile);
    const depGraph = JSON.stringify(obj);
    // 传入的graph里面有require和exports,所以要解析成浏览器认识的代码
    // 解析code中的require和exports为浏览器做的
    // 将代码中的每个模块的export的内容作为exports的属性，最后将exports对象作为require的返回值
    const bundle = `(function(graph){
        function require(module){
            function localRequire(relativePath){
                return require(graph[module].dependecies[relativePath])
            }
            var exports = {};
            (function(require,exports,code){
                eval(code);
            })(localRequire,exports,graph[module].code);
            console.log(exports);
            return exports;
        }
        require('${entryFile}');
    })(${depGraph})`;
    fs.writeFileSync(path.relative(__dirname,"./dist/main.js"),bundle,"utf-8");
}
genCode("./src/index.js");

