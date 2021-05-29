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
    email:{type:String,,unique:true},
    address:{type:String},
    MRN:{type:String},
    photo:{type:String},
    sign:{type:String}
});

module.exports=doc;

/*
First Name
Last Name
Gender
Date of Birth
Qualification
Specialization (eg Cardiology, Oncology, Pediatrics)
Hospital/Clinic Name
Experience
Mobile Number
Email ID
Address
Medical Registration Number 
Uploads -
ID Proof
Photo
Signature

*/