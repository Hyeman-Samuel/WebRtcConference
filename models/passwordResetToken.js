const Mongoose=require('mongoose');

const passwordResetTokenSchema=new Mongoose.Schema({
"userId":{type:String,required:true,unique:true},
"hash":{type:String,required:true},
"DateCreated":{type:Date,default:Date.now(), expires:600}
})

 
const PasswordResetToken = Mongoose.model('passwordResetToken',passwordResetTokenSchema);

module.exports={
    PasswordResetToken
}