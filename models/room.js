const Mongoose=require('mongoose');

const RoomSchema=new Mongoose.Schema({
"PublicId":{type:String,required:true},
"BroadcasterId":{type:String,required:true},
"User":{type:Mongoose.Schema.Types.ObjectId,ref:"Users"},
"socketId":{type:String}
})

const Room= Mongoose.model('Rooms',RoomSchema);

module.exports={
    Room
}