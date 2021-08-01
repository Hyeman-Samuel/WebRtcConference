const Mongoose=require('mongoose');

const UserSchema=new Mongoose.Schema({
"Username":{type:String,required:true,unique:true},
"Password":{type:String,required:true},
"Role":{type:String,required:true}
})

const UserRoles = {
    User: 1,
    Admin: 2
 };
 Object.freeze(UserRoles);
 
const User= Mongoose.model('Users',UserSchema);

module.exports={
    User,
    UserRoles
}