const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let doc= new Schema({
    name:{
        fname:{type:String},
        lname:{type:String}
    },
    gender:{type:String},
    DOB:{type:Date},
    qualification:{type:String},
    specialization:{type:String},
    hospital:{type:String},
    Experiance:{type:Number},
    phone:{type:String,unique:true},
    email:{type:String,unique:true},
    address:{type:String},
    MRN:{type:String},
    proof:{type:String},
    photo:{type:String},
    sign:{type:String}
});

module.exports=doc;

