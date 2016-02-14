var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partial = require('express-partial');
var mongoose=require('mongoose');
var moment=require('moment');
var session = require('express-session');
// var mongoStore=require('connect-mongo')(session);
var mongoStore=require('connect-mongo/es5')(session);
var flash = require('connect-flash');
var dbUrl='mongodb://localhost/shuanghu';

var routes = require('./routes/index');

var app = express();

mongoose.connect(dbUrl);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partial());
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'shuanghu',
  store:new mongoStore({
    url:dbUrl,
    collection:'sessions'
  })
}));
app.locals.moment=moment;
app.locals.user=null;


app.use(routes);
app.use(favicon);

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


module.exports = app;
