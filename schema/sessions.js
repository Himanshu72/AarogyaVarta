const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let session= new Schema({
    topic:{type:String},
    description:{type:String},
    prescription:{type:String},
    session:{type:String},
    startage:{type:Number},
    endage:{type:Number},
    comborbidities:[{type:String}],
    Symptons:[{type:String}],
    meet:[{type:String}],
    docID:{type:String}

});

module.exports=session;