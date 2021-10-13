const Mongoose=require('mongoose');

const LoginSchema=new Mongoose.Schema({
"token":{type:String,required:true,unique:true},
"expiringDate":{type:String,required:true},
"email":{type:String,required:true}
})

 
const Login= Mongoose.model('Logins',LoginSchema);

module.exports={
    Login
}