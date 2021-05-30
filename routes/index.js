var express = require('express');
var router = express.Router();
const db=require("../utility/db");

const path = require('path');

auth=(req,res,next)=>{
    if(req.session.user)
        next();
    else
      res.redirect("/login/?code=2");    
}

unauth=(req,res,next)=>{
  if(req.session.user)
      res.redirect(`/dashboard/${req.session.user._id}`)
   else
      next();   
}

checkdash=(req,res,next)=>{
    if(req.session.user._id==req.params.id)
          next()
    else{
      let i=req.originalUrl.lastIndexOf("/");
     let route=req.originalUrl.substring(1,i);
      
      res.redirect(`/${route}/${req.session.user._id}`);    
    }  
}

/* GET home page. */
router.get('/', async function(req, res, next) {

    res.render('index', { title: 'home',data:{auth:true} });
});

router.get('/temp', function(req, res, next) {
  res.render('temp', { title: 'template' });
});

router.get('/login',unauth ,function(req, res, next) {
  console.log(req.query);
  switch(req.query.code){
      
      case "1":
        res.render('login', { title: 'login',data:{auth:false},alert:{title:"ERROR!",type:"error",msg:"Email Not Found"} });
        break;
      case "2":
        res.render('login', { title: 'login',data:{auth:false},alert:{title:"ERROR!",type:"error",msg:"Please login"} });
       break;
       case "3":
        res.render('login', { title: 'login',data:{auth:false},alert:{title:"ERROR!",type:"error",msg:"Invalid Password"} });
         break; 
        default:   
        
       res.render('login', { title: 'login',data:{auth:false},alert:{title:"",type:"",msg:"" }});
      }
    
});

router.get('/dashboard/:id', auth,checkdash,async function(req, res, next) {
  try{
    let meets=[];
    let sessions=await db.getSessions(req.params.id);
    //console.log(sessions);
    sessions.forEach(ele=>{
          if(ele.meet.length > 0){
            meets.push(...ele.meet);
          }
    });
    let fullmeets= await db.getMeets(meets);
  
    switch(req.query.code){
      case "1":
        throw 1;
      case "2":
        res.render('dashboard', { title: 'dashboard',data:{auth:true,meets:fullmeets,sessions:sessions},alert:{type:"success",msg:"Meet Scheduled",title:"Great!"} });  
      default:
        res.render('dashboard', { title: 'dashboard',data:{auth:true,meets:fullmeets,sessions:sessions},alert:{type:"",msg:"",title:""} });
    }
    
  }catch(err){
   console.log(err); 
   res.render('dashboard', { title: 'dashboard',data:{auth:true,meets:[],sessions:[]},alert:{type:"error",msg:"Something Went Wrong",title:"ERROR!"} });
  }
});
router.get('/previous/:id',auth,checkdash, function(req, res, next) {
  res.render('prev', { title: 'Previous Sessions',data:{auth:true} });
});
router.get('/create', auth, function(req, res, next) {
  switch(req.query.code){
      case "1":
        res.render('sessionform', { title: 'session',data:{auth:true},alert:{title:"GREAT!",msg:"session created",type:"success"} });
      case "2":
        res.render('sessionform', { title: 'session',data:{auth:true},alert:{title:"ERROR!",msg:"Something Went Wrong",type:"error"} });
      default :    
      res.render('sessionform', { title: 'session',data:{auth:true},alert:{title:"",msg:"",type:""} });
  }
  
});
router.get('/profile',auth ,function(req, res, next) {
  res.render('profile', { title: 'profile',data:{auth:true,user:req.session.user} });
});

router.get('/registration',unauth ,function(req, res, next) {
  switch(req.query.code){
    case "1":
      res.render('reg', { title: 'registration',data:{auth:false},alert:{title:"ERROR!",msg:"Something Went Wrong",type:"error"} }); 
    default:
      res.render('reg', { title: 'registration',data:{auth:false},alert:{title:"",msg:"",type:""} });
  }
 
});
router.get("/logout",auth,(req,res)=>{
  req.session.destroy();;
  res.redirect("/login");
});
router.post("/reg",async (req,res)=>{

  try{  
  console.log(req.body);
  //console.log(req.file.fieldname);
  console.log(req.files);
  req.body.name={};
    req.body.name.fname=req.body.fname;
    req.body.name.lname=req.body.lname;
    let username="d"+req.body.phone
    req.files.proof.mv(path.join(__dirname, '../public/data/', username+"proof"), (err) => {
      if (err) throw err;
    });
    
    req.files.photo.mv(path.join(__dirname, '../public/data/', username+"photo"), (err) => {
      if (err) throw err;
    });

   

    req.body.proof=username+"proof";
    req.body.photo=username+"photo"
    

   await db.insertDoc(req.body);  


    res.redirect("/login");
  }catch(err){
    console.log(err);
    res.redirect("/registration?code=1");
  }
});

router.get('/udashboard',function(req, res, next) {
  res.render('userdashboard', { title: 'dashboard',data:{auth:true,rec:[],doc:[],meets:[]} });
});

router.post("/login",async (req,res)=>{
        console.log(req.body);
        ;
        let data=await db.findUserByID(req.body);
        if(data){
          if(data.pass==req.body.password){
          req.session.user=data;
          res.redirect("/dashboard/1");
          }else{
            res.redirect("/login?code=3");  
          }
        }else{
          res.redirect("/login?code=1");
        }
        console.log(data);
});

router.post("/createsession",auth,async (req,res)=>{
      
  try{
  console.log(req.body);
  req.body.docID=req.session.user._id;
   let data=await db.insertSession(req.body);  
   req.files.prescription.mv(path.join(__dirname, '../public/data/', data._id+".pdf"), (err) => {
    if (err) throw err;
  });
  await db.updatePrescription(data._id); 
  res.redirect("/create?code=1")
  }
  catch(err){
    console.log(err);
    res.redirect("/create?code=2")
  }
});

router.post("/meet/:sid",auth,async (req,res)=>{
      try{
          let meet=await db.insertMeet(req.body);
         console.log("meet",meet);
          await db.addMeet(req.params.sid,meet._id);
          console.log("met///");
          res.redirect(`/dashboard/${req.session.user._id}/?code=2`);
      }catch(err){
        console.log(err);
        res.redirect(`/dashboard/${req.session.user._id}/?code=1`);
      }
});

router.get('/usession', function(req, res, next) {
  res.render('userenroledsession', { title: 'session',data:{auth:true} });
});

router.get('/uregistration', function(req, res, next) {
  res.render('ureg', { title: 'registration',data:{auth:true} });
});

router.get('/uprofile',function(req, res, next) {
    res.render('uprofile', { title: 'profile',data:{auth:true} });
});


router.post('/getSession',async (req,res)=>{
  console.log(req.body)
  let recomanded=[];
  let data=await db.getSessionbyAge(req.body.age);
  console.log(data);
  if(data){
    data.forEach(ele=>{
      req.body.comborbidities.forEach(e=>{
        let c=ele.comborbidities.find(x=>x==e);
          if(c){
                if(recomanded.indexOf(ele)== -1)
                    recomanded.push(ele);

          }
      })
      req.body.Symptons.forEach(e=>{
              let k =ele.Symptons.find(x=>x==e);
              if(k){
                if(recomanded.indexOf(ele)== -1)
                recomanded.push(ele);
              }
      });
    });
}
let meets=[];
if(recomanded.length >0){
      recomanded.forEach(e=>{
          meets.push(...e.meet);
      })
  }
  console.log(meets);
  let fullmeets=await db.getMeets(meets);
  let docIDs=recomanded.map(e=>e.docID);
  let docs=await db.getDocByIds(docIDs);
  console.log(docs);
  res.render('userdashboard', { title: 'dashboard',data:{auth:true,rec:recomanded,meets:fullmeets,docs:docs} });
});

module.exports = router;
