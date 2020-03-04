const express = require("express");

const app = express();
app.get("/api/info",(req,res) => {
    res.json({
        name:"mock接口",
        age:"18",
        msg:"欢迎你哎呀！！！"
    })
})

app.listen("9092",function(){
    console.log("server is open at port:9092...");
});