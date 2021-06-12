var http = require("http")
var Express = require("express")
var fs = require("fs")
var app = Express()
app.use(Express.static(__dirname+"/public"))
var server=http.createServer(app)

var io = require("socket.io")(server)

io.sockets.on("error", (e) => {
    console.log(e)
})

server.listen(3000,()=>{
console.log("connected")
})

app.use("/broadcast",function(req,res){
    res.end(fs.readFileSync(__dirname+"/public/broadcaster.html"))
});
app.use("/watch",function(req,res){
    res.end(fs.readFileSync(__dirname+"/public/viewer.html"))
})

let broadcaster

io.sockets.on("connection", socket => {
  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });
    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });
    socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
    });
    socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
    });
});
