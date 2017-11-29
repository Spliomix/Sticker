var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var routes = require('./routes/index');
var userRoutes = require('./routes/user');
var MongoStore = require('connect-mongo')(session);
var app = express();
var uri = process.env.DBURL;;

mongoose.connect(uri, {useMongoClient: true});
require('./config/passport');


// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret', //should be saved in database? and a bit more complex
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 } //maybe endless?
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

app.use('/user', userRoutes);
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


module.exports = app;


app.post('/ajax', (req,res)=>{
    console.log(req.body)  //your variables are here.
    res.status(200).json({msg:'OK'});

});
//Database


var uri = 0;//type the database link here
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

