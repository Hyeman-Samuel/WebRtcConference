const express = require('express');
const bcrypt =require("bcryptjs");
const Router= express.Router();
const { check, validationResult } = require('express-validator');
const {User,UserRoles}=require('../models/User');
const jwt = require("jsonwebtoken");
const LoginFailedRedirectPath = "login"
const LoginFailedMessage = "Invalid Login Attempt"
const SignUpFailedRedirectPath = "signup"





Router.get("/signup",async(req,res)=>{
res.render('signup.hbs',{layout:false,errors:req.session.errors!==undefined?req.session.errors:null})
req.session.errors = null;
})

Router.post("/signup",validateSignUp(),async(req,res)=>{

    var errors = validationResult(req).array()

    if(errors.length != 0){
        req.session.errors = errors;
        res.redirect(SignUpFailedRedirectPath);
        return
    }
    const user = new User({"Username":req.body.Username,
                            "Password":await bcrypt.hash(req.body.Password,10),
                            "Role":UserRoles.User})
    await user.save();

    LogUserIn(res,user)
})




Router.get("/login",async(req,res)=>{
    res.render('login.hbs',{layout:false,errors:req.session.errors})
    req.session.errors = null;
})



Router.post("/login",validateLogin(),async(req,res)=>{
    var errors = validationResult(req).array()

    if(errors.length != 0){
        FailLoginAttempt(req,res,errors)
        return
    }
const user = await User.findOne({"Username":req.body.Username,"Role":UserRoles.User}).lean();
if(!user){
    var error = {msg:LoginFailedMessage,param:""}
    FailLoginAttempt(req,res,[error])
     return
}
const isPassword= await bcrypt.compare(req.body.Password,user.Password);
if(!isPassword){
    var error = {msg:LoginFailedMessage,param:""}
    FailLoginAttempt(req,res,[error])
    return
};

    LogUserIn(res,user)
})














module.exports = Router



function LogUserIn(res,User){
    const token = jwt.sign({user:User},'secretKey')
    res.cookie('authcookie',token,{maxAge:900000,httpOnly:true}) 
    
    res.redirect('/')
}

function FailLoginAttempt(req,res,errors){
    
    req.session.errors =errors
     res.redirect(LoginFailedRedirectPath);
}

function validateSignUp(){
    return [  check('Username', 'Username is required'),
       check('Password', 'Password is requried')
       .isLength({ min: 1 })
   ]
   }



function validateLogin(){
 return [  check('Username', 'Username is required'),
    check('Password', 'Password is requried')
    .isLength({ min: 1 })
]
}
