var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var textdb = require('../models/text');
var url = require('url');
router.use(passport.session())
var actURL;
var oldURL;
var olderURL;
/* GET home page. */
router.get('/', function (req, res, next) {  
        res.render('shop/index');
});

var mongoose = require('mongoose');
var uri = process.env.DBURL;//should be in .env

mongoose.connect(uri, {useMongoClient: true});


//write inputs in the database
router.post('/texti', function(req, res, next) {
 
  var item= {
    email : req.user.email,
    text : req.body.stickertag,
    website : actURL.search
  }
   console.log("items saved"+item);
  var data = new textdb(item);
  data.save();
  res.redirect(req.get('referer'));
  //res.redirect('/');
});

   
//get text from the database
router.get('/get-data', function(req, res, next) {
  if (req.isAuthenticated()){
    textdb.find({'email' : req.user.email}, function(err, result){
       if(err)throw err;
       res.render('shop/index', {items: result});
  });}else {
     res.render('shop/index');            
   }});




router.get('/window', function(req, res){
  actURL = url.parse(req.url, true);
  if (req.isAuthenticated()){
    textdb.find({'email' : req.user.email}, function(err, result){
       if(err)throw err;
       res.render('shop/window', {items: result});
  });}else {
     res.render('shop/window');            
   }});

router.post('/window', function(req, res){
    textdb.find({'email' : req.user.email}, function(err, result){
       if(err)throw err;
       res.render('shop/window', {items: result});

  });
    setTimeout(function () {
  oldURL=actURL;
 //dont know how this work?
  }, 15000);
  });


module.exports = router;