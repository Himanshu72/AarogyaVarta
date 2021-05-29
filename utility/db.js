const mongoose = require("mongoose");
const env=require("../env");
const doc=require("../schema/doc");
const meet = require("../schema/meet");
const session=require("../schema/sessions");
mongoose.connect(env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  var db = mongoose.connection;
  
  db.on("error", console.error.bind(console, "connection error:"));

  const docModel= mongoose.model("docs",doc);
  const sessModel= mongoose.model("sessions",session);
  const meetModel= mongoose.model("meets",meet);

  module.exports={
      insertDoc:async (obj)=>{
        try{  
        const docData=new docModel(obj);
          let res=await  docData.save();
          return res;
        }catch(e){
            throw e;
        }  
      },
      insertMeet:async (obj)=>{
        try{  
            const meetData=new meetModel(obj);
              let res=await  meetData.save();
              return res;
            }catch(e){
                throw e;
            } 
      },
      insertSession:async (obj)=>{
        try{  
            const sessData=new sessModel(obj);
              let res=await  sessData.save();
              return res;
            }catch(e){
                throw e;
            }
      },
      findUserByID:async(obj)=>{
          try{
           let res =await docModel.findOne({email:obj.emal});
            return res;
          }catch(err){
            throw err;
          }
      }
  }