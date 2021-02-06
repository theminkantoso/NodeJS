const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        if (favorites) {
            var user_favorites;

            //find the user in the favorite list which matches the id of the incoming request
            //then assign the user's ID found to the user_favorites variable

            user_favorites = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0]; 
            if( !user_favorites) {
                var err = new Error('You have no personal favorites, your favorite list does not exist!'); 
                err.status = 404;
                return next(err);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(user_favorites);
        } else { 
            //no favorite available

            var err = new Error('No favorite list exist yet');
            err.status = 404;
            return next(err);
        }
        
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        var user;
        if(favorites) {

            //find the user in the favorite list which matches the id of the incoming request
            //then assign the user's ID found to the user variable

            user = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
        }
        if( !user) {
            user = new Favorites({
                user: req.user.id
            });
        }
        for(let i of req.body){
            if(user.dishes.find((jId) => {
                if(jId._id){
                    return jId._id.toString() === i._id.toString();
                }
            })) {
                //if the dish has already existed in the favorite list then skip

                continue;
            }
            user.dishes.push(i._id);
        }
        user.save()
        .then((userFavors) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(userFavors);
            console.log("Favorites Created");
        }, (err) => next(err))
        .catch((err) => next(err));  
    })
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        var favDel;
        if (favorites) {
            
            //find the user in the favorite list which matches the id of the incoming request
            //then assign the user's ID found to the user variable

            favDel = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
        } 
        if(favDel){
            favDel.remove()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish);
                }, (err) => next(err));
            
        } else {
            var err = new Error('You do not have any favorites');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err)); 
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        if (favorites) {
            //explained above
            var favs = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
            //assign the specific dish
            var dish = favs.dishes.filter(dish => dish._id === req.params.dishId)[0];
            if(dish) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            } else {
                var err = new Error('You do not have dish ' + req.params.dishId);
                err.status = 404;
                return next(err);
            }
        } else {
            var err = new Error('You do not have any favorites');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        var user;
        if(favorites)
            user = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
        if( !user) 
            user = new Favorites({
                user: req.user.id
            });
        if( !user.dishes.find((jId) => {
            if(jId._id)
                return jId._id.toString() === req.params.dishId.toString();
        })){
            user.dishes.push(req.params.dishId);
        }
        
        user.save()
        .then((userFavs) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(userFavs);
            console.log("Favorites Created");
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        var user;
        if(favorites)
            user = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
        if(user){

            //save all dishes except the given one in the delete request
            //an effective way to delete

            user.dishes = user.dishes.filter((dishId) => dishId._id.toString() !== req.params.dishId);
            user.save()
            .then((result) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(result);
            }, (err) => next(err)); 
        } else {
            var err = new Error('You do not have this favorites');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = favoriteRouter;