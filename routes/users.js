var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser    = require('body-parser');
var expressValidator = require('express-validator');
var hbs = require('express-handlebars');
var path = require('path');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressValidator())
app.use(express.static('public'));

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.post('/login', function(req, res){
  res.render(__dirname + '/views/register.hbs');
});



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
    res.sendFile(__dirname + '/views/index.html');
  }
});

module.exports = app;
