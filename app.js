var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var bookmarkRouter = require('./routes/bookmark');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Custom static file
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js'))
app.use('/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/js'))
app.use('/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/css'))
app.use('/axios', express.static(__dirname + '/node_modules/axios/dist'))
app.use('/redom', express.static(__dirname + '/node_modules/redom/dist'))
app.use('/bootbox', express.static(__dirname + '/node_modules/bootbox/dist'))
app.use('/awesome-notifications', express.static(__dirname + '/node_modules/awesome-notifications/dist'))
app.use('/viewerjs', express.static(__dirname + '/node_modules/viewerjs/dist'))

app.use('/', indexRouter);
app.use('/bookmark', bookmarkRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
