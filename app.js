var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

const session = require('express-session');
const { flash } = require('express-flash-message');

var controllerRouter = require('./routes/controller');
var bookmarkRouter = require('./routes/bookmark');
var clientRouter = require('./routes/client');
var layoutRouter = require('./routes/layout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Custom
app.use(cors())

// express-session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
    },
  })
);

app.use(flash({ sessionKeyName: 'flashMessage' }));

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
app.use('/jsonviewer', express.static(__dirname + '/node_modules/jquery.json-viewer/json-viewer'))

app.use('/draggable', express.static(__dirname + '/node_modules/@shopify/draggable/lib'))

global.appPort = 3000;
global.appName = "VideoWall"

app.use('/', controllerRouter);
app.use('/bookmark', bookmarkRouter);
app.use('/client', clientRouter);
app.use('/layout', layoutRouter);



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
