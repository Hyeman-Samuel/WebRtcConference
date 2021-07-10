const session = require('express-session');
var back = require('express-back');

module.exports=function (app){
    app.use(session({
        secret: "MyKey",
        saveUninitialized: false,
        resave: false,
        cookie: {
            expires: 600000
        }
    }));
    app.use(back());
        
}