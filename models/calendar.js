const mongoose=require('mongoose')

const calendarSchema=new mongoose.Schema({
    user_id:{type:mongoose.Types.ObjectId,ref:"User"},
    date:String,
    timeSlot:String,
    slotUpdaterId:Number,
    mediaUrl:String,
    slotAvailability:Boolean,
    year:String,
    month:String
  

})

module.exports=mongoose.model('Calendar',calendarSchema)