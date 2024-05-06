const createError = require('http-errors');
const express = require('express');
const path = require('path');
const passport = require('passport');
const methodOverride = require('method-override')
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Fix: Pass session to connect-mongo
const mongoose = require('mongoose');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// MongoDB session store
const mongoStore = MongoStore.create({
  mongoUrl: 'mongodb+srv://adityasharma0431:anant99@cluster0.z5dehxj.mongodb.net/'
});

// Session middleware
app.use(session({
  secret: 'cat',
  resave: false,
  saveUninitialized: true,
  store: mongoStore,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Error handling middleware
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
