var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var textdb = require('../models/text');
router.use(passport.session())


/* GET home page. */
router.get('/', function (req, res, next) {  
        res.render('shop/index');
});

var mongoose = require('mongoose');
var uri = process.env.DBURL;//should be in .env

mongoose.connect(uri, {useMongoClient: true});


//write inputs in the database
var actUser;
router.post('/texti', function(req, res, next) {
 actUser=req.user.email;
  var item= {
    email : req.user.email,
    text : req.body.stickertag,
    website : "local"
  }
  var data = new textdb(item);
  data.save();
  
  res.redirect('/');
});

   
//get text from the database
router.get('/get-data', function(req, res, next) {
 var help;
  if (req.isAuthenticated()){
    help=true;
    actUser=req.user.email;
    textdb.find({'email' : actUser}, function(err, result){
       if(err)throw err;
       res.render('shop/index', {items: result, helper:help});
  });}else {
     help=false;  
     res.render('shop/index', {helper:help});            
   }});




module.exports = router;