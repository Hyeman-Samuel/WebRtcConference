const Express = require('express');
const Router = Express.Router();
const {Room} = require("../models/room")
const {TokenChecker} = require("../utility/auth")
const { v4: uuidv4 } = require('uuid');
Router.post("/",TokenChecker,async(req,res)=>{
    var room = new Room({"PublicId":uuidv4(),
                        "BroadcasterId":uuidv4(),
                        "User":req.user}) 
        await room.save()

        res.redirect(`broadcast/${room.BroadcasterId}`)
})

Router.get("/broadcast/roomPublicId",async(req,res)=>{
    var room = await Room.find({"PublicId":req.params.roomPublicId})
    res.render("viewer.hbs",{layout:null,"RoomId":room.id})    
})


Router.get("/:broadcasterId",async(req,res)=>{
    var room = await Room.find({"broadcasterId":req.params.broadcasterId})
    res.render("broadcaster.hbs",{layout:null,"RoomId":room.id})     
})


module.exports = Router