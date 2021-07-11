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

        res.redirect(`room/broadcast/${room.BroadcasterId}`)
})

Router.get("/watch/:roomPublicId",async(req,res)=>{
    var room = await Room.findOne({"PublicId":req.params.roomPublicId}).lean()
  //null check here  
    res.render("viewer.hbs",{layout:null,"RoomId":room._id})    
})


Router.get("/broadcast/:broadcasterId",async(req,res)=>{
    var room = await Room.findOne({"BroadcasterId":req.params.broadcasterId}).lean()
    //null check here
    res.render("broadcaster.hbs",{layout:null,"RoomId":room._id})     
})


module.exports = Router