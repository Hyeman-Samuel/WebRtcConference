const {Room} = require("../models/room")

module.exports = function(server){
    var io = require("socket.io")(server)

    io.sockets.on("error", (e) => {
        console.log(e)
    })

    //let broadcaster
    io.sockets.on("connection", socket => {
    socket.on("broadcaster", async (room) => {
        await Room.findOneAndUpdate({"_id":room},{"SocketId":socket.id},{new:true}).lean()
        socket.join(room)
        socket.broadcast.emit("broadcaster");
    });
    
    socket.on("watcher", async (room) => {
       var room = await Room.findOne({"_id":room})
        socket.to(room.SocketId).emit("watcher", socket.id);
    });

    socket.on("disconnect", async () => {
        socket.emit("disconnectPeer", socket.id);
        await Room.findOneAndUpdate({"SocketId":socket.id},{"IsActive":false})
        ///emit to all sockets in this room
    });

    // socket.on("disconnecting",async () =>{

    // })
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