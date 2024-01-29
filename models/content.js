
const mongoose=require('mongoose')

const contentSchema=new mongoose.Schema({
    contentDate:String,
    contentTimeSlot:String,
    contentUploaderId:Number,
    contentmediaUrl:String,
    desc:String
  

})

module.exports=mongoose.model('Content',contentSchema)