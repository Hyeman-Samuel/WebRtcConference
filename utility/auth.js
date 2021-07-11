const jwt = require("jsonwebtoken");
const config = require("config");
var TokenChecker = (req, res, next) => {
    const authcookie = req.cookies.authcookie

    jwt.verify(authcookie,'secretKey',(err,data)=>{
     if(err){
      res.redirect("/user/login");
     } 
     else if(data.user){
      req.user = data.user
       next()
    }
  })
};

module.exports = {TokenChecker}