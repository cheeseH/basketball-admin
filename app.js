var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var games = require('./routes/games');
var competitions = require('./routes/competitions');
var informations = require('./routes/information');
var teams = require('./routes/team');
var flash  = require('connect-flash');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
      secret: '12345',
      name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
      cookie: {maxAge: 30*24*60*60*1000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
      resave: false,
      saveUninitialized: true,
 }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/games',games);
app.use('/competitions',competitions);
app.use('/teams',teams);
app.use('/informations',informations);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handlers
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

if(!module.parent){
  var port = 3030;
  var server = app.listen(port,function(){
    console.log("------------------------------------");
    console.log("管理后台");
    console.log("Express server listening on port %s:%d in %s mode",server.address().address,port,app.settings.env);
    console.log("------------------------------------")
  });
}

module.exports = app;
