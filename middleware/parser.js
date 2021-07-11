const cookieParser = require('cookie-parser');
const BodyParser=require('body-parser');

module.exports=function (app){
    app.use(BodyParser.urlencoded({extended:true}));
    app.use(cookieParser());
}