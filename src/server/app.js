var createError = require('http-errors');
var assert = require('assert');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
var logger = require('morgan');

// routers
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

//Import the mongoose module
var mongoose = require('mongoose');
const morgan = require('morgan');

// DB Connection URL
const url = 'mongodb://localhost:27017/myProject';

var app = express();
app.use(morgan("dev"));

// allow cross origin
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  'useFindAndModify': false,
  'useCreateIndex': true
  })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
  console.log("error in mongoose");
  });
  
  mongoose.set('useNewUrlParser', true);


// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/index', indexRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;