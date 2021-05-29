var express = require('express');
var router = express.Router();
const db=require("../utility/db");
/* GET home page. */
router.get('/', async function(req, res, next) {
 
  res.redirect("/login");
});

router.get('/temp', function(req, res, next) {
  res.render('temp', { title: 'template' });
});

router.get('/login', function(req, res, next) {
  
  res.render('login', { title: 'login',data:{auth:false} });
});

router.get('/dashboard/:id', function(req, res, next) {
  res.render('dashboard', { title: 'dashboard',data:{auth:true} });
});
router.get('/previous/:id', function(req, res, next) {
  res.render('prev', { title: 'Previous Sessions',data:{auth:true} });
});
router.get('/create', function(req, res, next) {
  res.render('sessionform', { title: 'session',data:{auth:true} });
});
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'profile',data:{auth:true} });
});

router.get('/registration', function(req, res, next) {
  res.render('reg', { title: 'registration',data:{auth:false} });
});

router.post("/reg",async (req,res)=>{
  try{  
  console.log(req.body);
    req.body.name={};
    req.body.name.fname=req.body.fname;
    req.body.name.fname=req.body.lname;
    await db.insertDoc(req.body);  
    res.redirect("/login");
  }catch(err){
    console.log(err);
    res.redirect("/registration?code=1");
  }
});

module.exports = router;
