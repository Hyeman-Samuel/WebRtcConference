var TokenChecker = (req, res, next) => {
    const authcookie = req.cookies.authcookie

    jwt.verify(authcookie,config.get("SecretKey"),(err,data)=>{
     if(err){
      res.redirect("login");
     } 
     else if(data.user){
      req.user = data.user
       next()
    }
  })
};

module.exports = {TokenChecker}