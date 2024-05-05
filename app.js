var createError = require('http-errors');
var express = require('express');
var path = require('path');
const passport = require('passport');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const router = require('./routes/index');

var app = express();
// app.use(session({
//   secret: 'your-secret-key', // Change this to a random string
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({
//     mongoUrl: 'mongodb+srv://adityasharma0431:anant99@cluster0.z5dehxj.mongodb.net/'
//   }),
//   // ,
//   // cookie: {
//   //   maxAge: new Date(Date.now()+ (3600000) )
//   // }
// }));

app.use(session({
  secret: 'cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: MongoStore.create({
        mongoUrl: 'mongodb+srv://adityasharma0431:anant99@cluster0.z5dehxj.mongodb.net/'
      })
}));





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// app.use('/', require('./routes/auth'));
// app.use('/', require('./routes/dashboard'));



app.use(passport.initialize());
app.use(passport.session());


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
