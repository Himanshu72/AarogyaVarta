var express = require('express');
var router = express.Router();
const db=require("../utility/db");

const path = require('path');

auth=(req,res,next)=>{
    if(req.session.user)
        next();
    else
      res.redirect("/login?code=2");    
}

unauth=(req,res,next)=>{
  if(req.session.user)
      res.redirect(`/dashboard/${req.session.user._id}`)
   else
      next();   
}

/* GET home page. */
router.get('/', async function(req, res, next) {
 
  res.redirect("/login");
});

router.get('/temp', function(req, res, next) {
  res.render('temp', { title: 'template' });
});

router.get('/login',unauth ,function(req, res, next) {
  console.log(req.session.v);
  res.render('login', { title: 'login',data:{auth:false} });
});

router.get('/dashboard/:id', auth,function(req, res, next) {
  res.render('dashboard', { title: 'dashboard',data:{auth:true} });
});
router.get('/previous/:id',auth, function(req, res, next) {
  res.render('prev', { title: 'Previous Sessions',data:{auth:true} });
});
router.get('/create', auth, function(req, res, next) {
  res.render('sessionform', { title: 'session',data:{auth:true} });
});
router.get('/profile',auth ,function(req, res, next) {
  res.render('profile', { title: 'profile',data:{auth:true} });
});

router.get('/registration',unauth ,function(req, res, next) {
  res.render('reg', { title: 'registration',data:{auth:false} });
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
    req.body.name.fname=req.body.lname;
    let username="d"+req.body.phone
    req.files.proof.mv(path.join(__dirname, '../public/data/', username+"proof"), (err) => {
      if (err) throw err;
    });
    
    req.files.photo.mv(path.join(__dirname, '../public/data/', username+"photo"), (err) => {
      if (err) throw err;
    });

    req.files.MRN.mv(path.join(__dirname, '../public/data/', username+"MRN"), (err) => {
      if (err) throw err;
    });

    req.body.proof=username+"proof";
    req.body.photo=username+"photo;"
    req.body.MRN=username+"MRN";

   await db.insertDoc(req.body);  


    res.redirect("/login");
  }catch(err){
    console.log(err);
    res.redirect("/registration?code=1");
  }
});

router.get('/udashboard/:id',function(req, res, next) {
  res.render('userdashboard', { title: 'dashboard',data:{auth:true} });
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


router.get('/usession', function(req, res, next) {
  res.render('userenroledsession', { title: 'session',data:{auth:true} });
});

router.get('/uregistration', function(req, res, next) {
  res.render('ureg', { title: 'registration',data:{auth:true} });
});
module.exports = router;
