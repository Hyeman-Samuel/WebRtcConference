const express = require('express');
const bcrypt =require("bcryptjs");
const Router= express.Router();
const {check, validationResult } = require('express-validator');
const {User,UserRoles}=require('../models/user');
const {PasswordResetToken}=require('../models/passwordResetToken');
const {Login}=require("../models/logins");
const {SendHbsEmail,SendTextEmail}=require("../utility/mailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const LoginFailedRedirectPath = "login"
const LoginFailedMessage = "Invalid Login Attempt"
const SignUpFailedRedirectPath = "signup"
const PasswordResetRedirectPath = ""




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
    const user = new User({"Username":req.body.Username.toLowerCase(),
                            "Password":await bcrypt.hash(req.body.Password,10),
                            "Role":UserRoles.User})
    await user.save();

    LogUserIn(res,user)
})




Router.get("/login",async(req,res)=>{
    if(req.cookies.authcookie){
        res.redirect("/")
        return;
    }
    res.render('login.hbs',{layout:false,errors:req.session.errors})
    req.session.errors = null;
})



Router.post("/login",validateLogin(),async(req,res)=>{
    var errors = validationResult(req).array()

    if(errors.length != 0){
        FailLoginAttempt(req,res,errors)
        return
    }
const user = await User.findOne({"Username":req.body.Username.toLowerCase(),"Role":UserRoles.User});
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
    const logins = await Login.find({expiringDate: { $gt:Math.floor(Date.now() / 1000)},email:req.body.Username.toLowerCase()}).lean()
    if(logins.length !== 0){
    var error = {msg:"already logged in on another device",param:""}
    FailLoginAttempt(req,res,[error])
    return
    }


    LogUserIn(res,user)
})


Router.get("/logout",async (req,res)=>{
        if(req.cookies.authid){
        try {
            await Login.findByIdAndDelete(req.cookies.authid) 
        } catch (error) {
            res.redirect('back');
        return 
        }             
    }
        req.cookies = null;
        res.redirect("/");
})



Router.get("/forgotpassword",async (req,res)=>{
    res.render('forgotpassword.hbs',{layout:false,errors:req.session.errors})
    req.session.errors = null
})

Router.post("/forgotpassword",async (req,res)=>{
    const user = await User.findOne({"Username":req.body.email.toLowerCase()});
    if(user == null){
        var error = {msg:"User not found",param:""}
        req.session.errors =[error]
        res.redirect("/user/forgotpassword");
        return
    }
    await PasswordResetToken.findOneAndDelete({"userId":user.id});
    var token = crypto.randomBytes(32).toString("hex");
    var hash = await bcrypt.hash(token, 10);
    const passwordResetToken = new PasswordResetToken({
    "userId":user.id,
    "hash":hash
    })
    passwordResetToken.save();
    await SendHbsEmail('./public/views/emailTemplate/passwordResetEmail.hbs',{domainUrl:req.hostname,token:token,user:user.id},user.Username,"Reset Password")

    res.redirect("/user/forgotpassword");
})


Router.get("/resetpassword",async (req,res)=>{
    if(!req.query.token){
        var error = {msg:"this link is invalid",param:""}
        req.session.errors =[error]
        res.redirect("/user/forgotpassword")
        return
    }
    const passwordResetToken = await PasswordResetToken.findOne({"userId":req.query.user})
    if(passwordResetToken == null){
        var error = {msg:"this link is expired",param:""}
        req.session.errors =[error]
        res.redirect("/user/forgotpassword")
        return
    }
    const isValid = await bcrypt.compare(req.query.token,passwordResetToken.hash)
    if(!isValid){
        var error = {msg:"this link is invalid",param:""}
        req.session.errors =[error]
        res.redirect("/user/forgotpassword")
        return
    }
    res.render('passwordReset.hbs',{layout:false,errors:req.session.errors,user:req.query.user,token:req.query.token})
    req.session.errors = null
})



Router.post("/resetpassword",async (req,res)=>{
    if(!req.body.token){
        var error = {msg:"this link is invalid",param:""}
        req.session.errors =[error]
        res.redirect("/forgotpassword")
        return
    }
    const passwordResetToken = await PasswordResetToken.findOne({"userId":req.body.user})
    if(passwordResetToken == null){
        var error = {msg:"this link is invalid",param:""}
        req.session.errors =[error]
        res.redirect("/forgotpassword")
        return
    }
    const isValid = await bcrypt.compare(req.body.token,passwordResetToken.hash)
    if(!isValid){
        var error = {msg:"this link is invalid",param:""}
        req.session.errors =[error]
        res.redirect("/forgotpassword")
        return
    }

    var newHash = await bcrypt.hash(req.body.password, 10);
   var user = await User.findOneAndUpdate({"_id":req.body.user},{"Password":newHash},{"new":true});

    await passwordResetToken.deleteOne();

    LogUserIn(res,user);
})













module.exports = Router



function LogUserIn(res,User){
    const token = jwt.sign({user:User},'secretKey')
    const sessionDurationInMilliSeconds = 60000;
    const newLogin = new Login({
        "token":token,
        "expiringDate":Math.floor(Date.now() / 1000) + (sessionDurationInMilliSeconds/1000),
        "email":User.Username.toLowerCase()
        })
        newLogin.save()
    const cookieOptions = {maxAge:sessionDurationInMilliSeconds,httpOnly:true}
    res.cookie('authcookie',token,cookieOptions); 
    res.cookie('authid',newLogin._id,cookieOptions);  
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
