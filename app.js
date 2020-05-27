require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet')
var session = require('express-session')


var indexRouter = require('./routes/index');
var carsRouter = require('./routes/cars');

var app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'porsche911',
  name: 'rennlist_scraper',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  httpOnly: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('rennlist_scraper'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet())


// app.use(pretty({ query: 'pretty' }));
app.set('json spaces', 2)

app.use('/', indexRouter);
app.use('/cars', carsRouter)

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
