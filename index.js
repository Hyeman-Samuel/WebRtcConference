var http = require("http")
var Express = require("express")
var fs = require("fs")
var app = Express()
app.use(Express.static(__dirname+"/public"))
var server=http.createServer(app)
var io = require("./utility/socker.io")
io(server)

server.listen(process.env.PORT,()=>{
console.log("connected")
})
app.use("/broadcast",function(req,res){
    res.end(fs.readFileSync(__dirname+"/public/broadcaster.html"))
});
app.use("/watch",function(req,res){
    res.end(fs.readFileSync(__dirname+"/public/viewer.html"))
})


