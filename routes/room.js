const Express = require('express');
const Router = Express.Router();

Router.get("/:id/broadcast/:uniqueId",async(req,res)=>{
    res.render("broadcaster.hbs",{layout:null})    
})

Router.get("/:broadcasterId/watch",async(req,res)=>{
    res.render("viewer.hbs",{layout:null})     
})


module.exports = Router