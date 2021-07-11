const Express = require('express');
const Router = Express.Router();
const {TokenChecker} = require("../utility/auth")
Router.get("",TokenChecker,async(req,res)=>{
   res.render("index.hbs",{layout:null})
})


module.exports = Router