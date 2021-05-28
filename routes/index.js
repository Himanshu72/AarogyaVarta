var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/temp', function(req, res, next) {
  res.render('temp', { title: 'template' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login',data:{} });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'dashboard',data:{} });
});

module.exports = router;
