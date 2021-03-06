var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');
require('./app_api/model/db');
var index = require('./app_server/routes/index');

const apiRoutes = require('./app_api/routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server','views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ 
  ////这里的name值得是cookie的name，默认cookie的name是：connect.sid
    //name: 'hhw',
    secret: 'keyboard cat', 
    cookie: ('name', 'value', { path: '/', httpOnly: true,secure: false, maxAge:  6000000 }),
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: true, 
    //强制“未初始化”的会话保存到存储。 
    saveUninitialized: true,  
    
  }))
app.use(express.static(path.join(__dirname, 'public/dist')));
app.use('/login',express.static(path.join(__dirname, 'public/dist')));
app.use('/itemlist',express.static(path.join(__dirname, 'public/dist')));
app.use('/signup',express.static(path.join(__dirname, 'public/dist')));

app.use('/', index);
app.use('/api', apiRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
