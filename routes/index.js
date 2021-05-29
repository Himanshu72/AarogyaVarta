var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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

module.exports = router;
