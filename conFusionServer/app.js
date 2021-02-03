var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');

const Dishes = require('./models/dishes');
const { EROFS } = require('constants');

// const url = 'mongodb://localhost:27017/conFusion';
var config = require('./config');
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => {
  console.log(err);
}); //establish connection to server 

var app = express();

// Secure traffic only
app.all('*', (req, res, next) => { //* is all
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  //f you say a localhost:3000, that localhost:3000 will be covered by the first part and this will be redirected to localhost:3443 by this configuration here
  //307 here represents that the target resource resides temporarily under different URL. 
  //And the user agent must not change the request method if it reforms in automatic redirection to that URL. 
  //So, I'll be expecting user agent to retry with the same method that they have used for the original end point.
}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(cookieParser('12345-67890-09876-54321'));

// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));

//if user is logged in it called the authenticate 'local' will automatically add user property to the request message
//the passport session automatically serialized the user info and store it in the session
//automatically load req.user
app.use(passport.initialize());
// app.use(passport.session());

//signup before authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);
//FROM TOKEN: leave the public folder open for anybody to access

//TOKEN: If a user is doing a get request, the user just wants to retrieve information. 
//So, for example, on the client side if I'm implementing a web application using Angular or a client application using Ionic or native script, 
//then maybe I want to implement my app in such a way that the main page will display information already, the genetic information that you want to make available to anybody that visits your website or that opens your app. 
//So, basic information can be displayed there. But if you want to change anything, then you expect the user to be authenticated. So, you will allow POST operations, put operations, and delete operations to be done only by authenticated users. Similarly, for comments for example, you can say that comments can be only posted or modified by authenticated users. 
//So, you can restrict only some routes for authenticated users, the other route you can leave them open.
//TOKEN

//=> GET is open, POST, PUT, DELETE requires authenticate

//user can access the index and users file without being authenticated
//however any other step will be required to be authenticated

//applied to every incoming request
// function auth(req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     //authentication was not been done
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   }
//   else {
//     next();
//   }
// }
// app.use(auth);
//REMOVE FROM TOKEN, only applied on certain routes 

  // console.log(req.session);
  // if (!req.session.user) {
  //   var err = new Error('You are not authenticated!');

  //   res.setHeader('WWW-Authenticate', 'Basic');
  //   err.status = 401; 
  //   return next(err); 
  // } else {
  //   if(req.session.user === 'authenticated') {
  //     next(); //allow request to pass through
  //   } else {
  //     var err = new Error('You are not authenticated!');
  //     err.status = 401; 
  //     return next(err);
  //   }
  // }

// function auth(req, res, next) {
//   //console.log(req.headers);
//   //console.log(req.signedCookies);
//   console.log(req.session);
//   if (!req.session.user) {
//     // var authHeader = req.headers.authorization;
//     if(!authHeader) {
//       var err = new Error('You are not authenticated!');
  
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401; //not authorized
//       return next(err); //next to the middleware handle error
//     }
    
  
//     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//      //second part of the array is the decoded string
//      //this operate two splits, one into the decoded string and one to divide this decoded string to username and password
//     var username = auth[0];
//     var password = auth[1];
  
//     if(username === 'admin' && password === 'password') {
//       req.session.user = 'admin'; 
//       //if the basic authentication is successful then setup the cookie in the client-side here
//       next(); //set no next middleware service the request
//     } else {
//       var err = new Error('You are not authenticated!');
  
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401; 
//       return next(err);
//     }
//   } else {
//     if(req.session.user === 'admin') {
//       next(); //allow request to pass through
//     } else {
//       var err = new Error('You are not authenticated!');
//       err.status = 401; 
//       return next(err);
//     }
//   }
// }


app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);


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
