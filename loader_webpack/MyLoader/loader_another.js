
module.exports = function(source){
    let sourceFile = source;
    let newSource = sourceFile.replace("loader_my","武汉加油，中国加油").replace("替换","哈哈哈哈");
    return newSource;
}