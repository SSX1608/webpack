module.exports = {
    plugins:[
        require("autoprefixer")({
          // autoprefixer新版本中browsers替换成overrideBrowserlist
          // browsers:["last 2 version",">1%"],
          overrideBrowserslist:["last 2 version",">1%"]
        })
    ]
}