var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  // User.findOne({username: req.body.username})
  //username and password will be pass in the json body part
  // .then((user) => {
  //   if(user != null) {
  //     //if it already exist in the system
  //     var err = new Error('User ' + req.body.username + ' already exists!');
  //     err.status = 403;
  //     next(err);
  //   } else {
  //     return User.create({
  //       username: req.body.username,
  //       password: req.body.password});
  //   }
  // })
  // .then((user) => {
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type', 'application/json');
  //   res.json({status: 'Registration Successful!', user: user});
  // }, (err) => next(err))
  // .catch((err) => next(err));

  //passport simplify the previous code
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
        if(req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
          user.lastname = req.body.lastname; 
        }
        user.save((err, user) => {
          if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return ;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
          });
        })
      }
    });
});

// router.post('/login', function(req, res, next) {
  // if(!req.session.user) {
  //   var authHeader = req.headers.authorization;
    
  //   if (!authHeader) {
  //     var err = new Error('You are not authenticated!');
  //     res.setHeader('WWW-Authenticate', 'Basic');
  //     err.status = 401;
  //     return next(err);
  //   }
  
  //   var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  //   var username = auth[0];
  //   var password = auth[1];
  
  //   User.findOne({username: username})
  //   .then((user) => {
  //     if (user === null) {
  //       //user does not exist
  //       var err = new Error('User ' + username + ' does not exist!');
  //       err.status = 403;
  //       return next(err);
  //     }
  //     else if (user.password !== password) {
  //       //user does exist
  //       var err = new Error('Your password is incorrect!');
  //       err.status = 403;
  //       return next(err);
  //     }
  //     else if (user.username === username && user.password === password) {
  //       req.session.user = 'authenticated';
  //       res.statusCode = 200;
  //       res.setHeader('Content-Type', 'text/plain');
  //       res.end('You are authenticated!')
  //     }
  //   })
  //   .catch((err) => next(err));
  // }
  // else {
  //   //already logged in, no need to verify
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type', 'text/plain');
  //   res.end('You are already authenticated!');
  // }

// })

//TOKEN:
//we're not going to be using sessions anymore. Instead, when the user is authenticated using the local strategy, we will issue a token to the user.
// So, inside this router.POST method that we have done on that /login endpoint, I'm going to create a token and pass this token back to the user

//Now, this scheme can also be used when you use third-party authentication like based on OAuth 2.0, which we will examine in the next module. 
//Now, the procedure will be similar.
// You will be creating a token when the user is authenticated by the third-party or OAuth authentication provider, and then you will pass the token back to the user, in a similar approach as you see here. 

// So, what happens now is that when the user authenticates on the /login endpoint and the user is successfully authenticated, then the token will be created by the server and sent back to the client or the user. 
//So, the client will include the token in every subsequent incoming request in the authorization header. 

router.post('/login', passport.authenticate('local'), (req, res) => {
  //PASSPORT: expect username and password to be included in the body of the incoming post message
  //if there is any error in the authentication function then an error will be sent back. We only proceed if authentication is successfull
  //simplify the code
  var token = authenticate.getToken({_id: req.user._id}); //sufficient enough, keep the JSON Web Token small
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res) => {
  if (req.session) {
    //if the session already exist
    req.session.destroy(); //cookie now become invalid, remove from the server side
    res.clearCookie('session-id'); //asking the client to remove the cookie from the client side
    res.redirect('/'); //redirect to the homepage
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
module.exports = router;
