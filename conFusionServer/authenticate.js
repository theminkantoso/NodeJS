var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user'); //import user

//verify function: verify user, extract username and password from the incoming request
exports.local = passport.use(new LocalStrategy(User.authenticate())); //built in authenticate function provide for localStrategy

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());