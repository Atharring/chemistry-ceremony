const mongoose=require('mongoose');
const BillSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    title:String,
    totalAmount:Number,
    peopleCount:Number,
    splitAmount:Number,
});

module.exports=mongoose.model('Bill',BillSchema);

