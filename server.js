// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var router = express.Router();
var mongodb = require('mongodb');
var bodyParser    = require('body-parser');
//var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var hbs = require('express-handlebars');
var path = require('path');
//var mongo = require('mongodb');
var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressValidator())
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//var routes = require('./routes/index');
//var users = require('./routes/users');

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/views/login.html');
  });

app.post('/login', function(req, res){
  res.render(__dirname + '/views/register.hbs');
});


/*
app.post('/register', function(req, res){
  var username= req.body.username;
  var password= req.body.password;
  
  //validation
  req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('username', 'Email is required').notEmpty();
	req.checkBody('username', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if(errors){
    res.render('register', { errors: errors });
	} else {
    res.render(__dirname + '/views/index.hbs');
  }
});
*/

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});



app.post('/ajax', (req,res)=>{
    console.log(req.body)  //your variables are here.
    res.status(200).json({msg:'OK'});

});
//Database


var uri = "mongodb://Spliomix:gigabyte1@ds019498.mlab.com:19498/sticker";
/*
mongodb.MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});
*/

//mongooseMlab();

var promise = mongoose.connect(uri, {useMongoClient: true});
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {collection: 'user-data'});

var UserData = promise.model('UserData', userDataSchema);

app.get('/get-data', function(req, res, next) {
  UserData.find()
      .then(function(doc) {
        res.render('register', {items: doc});
      });
});

app.post('/register', function(req, res, next) {
  var item = {
    username: req.body.username,
    password: req.body.password,
  };

  var data = new UserData(item);
  data.save();

  res.render(__dirname + '/views/register.hbs');
  
});


app.post('/update', function(req, res, next) {
  var id = req.body.id;

  UserData.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.username = req.body.username;
    doc.password = req.body.password;
    doc.save();
  })
   res.render(__dirname + '/views/register.hbs');
});