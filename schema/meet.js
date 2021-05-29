const mongoose = require("mongoose");
const  Schema = mongoose.Schema;

const meet= new Schema({
    shedule:{type:Date},
    duration:{type:Number},
    link:{type:String}
});

module.exports=meet;