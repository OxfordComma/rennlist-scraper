var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var helmet = require('helmet')
require('dotenv').config()
var session = require('express-session')


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth')
var carsRouter = require('./routes/cars');
var lastFmRouter = require('./routes/lastfm')
var dataRouter = require('./routes/data')
var updateRouter = require('./routes/update')

var app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'porsche911',
  name: 'rennlist_scraper',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  httpOnly: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('rennlist_scraper'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet())


// app.use(pretty({ query: 'pretty' }));
app.set('json spaces', 2)

app.use('/', indexRouter);
app.use('/auth', authRouter)
app.use('/cars', carsRouter)
app.use('/lastfm', lastFmRouter)
app.use('/data', dataRouter)
app.use('/update', updateRouter)

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
