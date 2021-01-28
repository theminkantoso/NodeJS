const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/') 
.get((req,res,next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions); //send back a respond to the server
    }, (err) => next(err))
    .catch((err) => next(err)); //pass the error to the overall error handling
})
//TOKEN: starts authenticating, authenticate.verifyUser is the barrier
.post(authenticate.verifyUser, (req,res,next) => {
    Promotions.create(req.body)
   .then((promotion) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion); //send back a respond to the server
   }, (err) => next(err))
   .catch((err) => next(err));
})
//TOKEN: starts authenticating, authenticate.verifyUser is the barrier
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403; 
    res.end('PUT operation not supported on /promotions');
})
//TOKEN: starts authenticating, authenticate.verifyUser is the barrier
.delete(authenticate.verifyUser, (req,res,next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId') 
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion); //send back a respond to the server
    }, (err) => next(err))
    .catch((err) => next(err));
})
//TOKEN: starts authenticating, authenticate.verifyUser is the barrier
.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403; 
    res.end('POST operation not supported on /promotions/' 
        + req.params.promoId);
})
//TOKEN: starts authenticating, authenticate.verifyUser is the barrier
.put(authenticate.verifyUser, (req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, {
        new: true //return new updated promotion
    })
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion); //send back a respond to the server
    }, (err) => next(err))
    .catch((err) => next(err));
})
//TOKEN: starts authenticating, authenticate.verifyUser is the barrier
.delete(authenticate.verifyUser, (req,res,next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// promoRouter.route('/') 
// .all((req,res,next) => {
  
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next(); 
// })
// .get((req,res,next) => {
//     res.end('Will send all the promotions to you!');
// })
// .post((req,res,next) => {
//     res.end('Will add the promotion: ' + req.body.name + 
//     ' with details: ' + req.body.description);
// })
// .put((req,res,next) => {
//     res.statusCode = 403; 
//     res.end('PUT operation not supported on /promotions');
// })
// .delete((req,res,next) => {
//     res.end('Deleting all the promotions');
// });

// promoRouter.route('/:promoId') 
// .get((req,res,next) => {
//     res.end('Will send details of the promotion: '
//         + req.params.promoId + ' to you!');
// })
// .post((req,res,next) => {
//     res.statusCode = 403; 
//     res.end('POST operation not supported on /promotions/' 
//         + req.params.promoId);
// })
// .put((req,res,next) => {
//     res.write('Updating the promotion: ' + req.params.promoId + '\n');
//     res.end('Will update the promotion: ' + req.body.name + ' with details: ' 
//         + req.body.description);
// })
// .delete((req,res,next) => {
//     res.end('Deleting promotion: ' + req.params.promoId);
// });

module.exports = promoRouter;