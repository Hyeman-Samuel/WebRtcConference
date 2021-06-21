
module.exports = function(server){
    var io = require("socket.io")(server)

    io.sockets.on("error", (e) => {
        console.log(e)
    })

    let broadcaster
    io.sockets.on("connection", socket => {
    socket.on("broadcaster", (room) => {
        broadcaster = socket.id;
        socket.join(room)
        socket.broadcast.emit("broadcaster");
    });
    
    socket.on("watcher", () => {
        socket.to(broadcaster).emit("watcher", socket.id);
    });

    socket.on("disconnect", () => {
        socket.to(broadcaster).emit("disconnectPeer", socket.id);

    });

    socket.on("offer", (id, message,room) => {
        socket.to(id).emit("offer", socket.id, message,room);
    });

    socket.on("answer", (id, message,room) => {
    socket.join(room)
    socket.to(id).emit("answer", socket.id, message);
    });


    socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
    });
    ///Room
        socket.on("leave",(room)=>{
        socket.to(room).emit("watcherleft")
        })
    });

}