var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user'); //import user
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config');

//verify function: verify user, extract username and password from the incoming request
exports.local = passport.use(new LocalStrategy(User.authenticate())); //built in authenticate function provide for localStrategy

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    //create a token
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 3600}); //3600 s = 1 hour
};

var opts = {};

//specifies how the jsonwebtoken should be extracted from the incoming request message
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

//supply the secret key which I'm going to be using within my strategy for the sign-in
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false); //error - user - info
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
}));
//done: callback

//we are not going to be creating sessions in this case
exports.verifyUser = passport.authenticate('jwt', {session: false});
//using jwt strategy
//incoming request, the token will be included in the authentication header. then extracted and 
//use to authenticate
//anytime I want to verify the user's authenticity, I can simply call verify user, and that will initiate the call to the passport.authenticate and verify the user. 
//If this is successful, it will allow me to proceed. 

// exports.verifyUser = function (req, res, next) {
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];
//     if (token) {
//         jwt.verify(token, config.secretKey, function (err, decoded) {
//             if (err) {
//                 var err = new Error('You are not authenticated!');
//                 err.status = 401;
//                 return next(err);
//             } else {
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {
//         var err = new Error('No token provided!');
//         err.status = 403;
//         return next(err);
//     }
// };

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin)
        next();

    else {
        var err = new Error('You are authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
};