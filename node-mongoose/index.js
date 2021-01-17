const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log('Connected correctly to server');

    // var newDish = Dishes({
    //     name: 'Uthappizza',
    //     description: 'test'
    // });
    // newDish.save()
    //     .then((dish) => {
    //         console.log(dish); // save the newDish

    //         return Dishes.find({}).exec(); 
    //         //find all the dishes. exec: ensure this is executed, return a promise
    //         //that promise can be returned so it can be chained the method to the remaining ones
    //         //return Dishes.find({}); 
    //     })
    //     .then((dishes) => {
    //         console.log(dishes);

    //         return Dishes.remove({});
    //     })
    //     .then(() => {
    //         return mongoose.connection.close();
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    Dishes.create({
        name: 'Uthappizza',
        description: 'test'
    })
    .then((dish) => {
        console.log(dish); // save the newDish

        return Dishes.findByIdAndUpdate(dish._id, {
            $set: {description: 'Updated test'}
        },{ //once updated complete, return a new dish back
            new: true
        }).exec(); 
        //find all the dishes. exec: ensure this is executed, return a promise
        //that promise can be returned so it can be chained the method to the remaining ones
        //return Dishes.find({}); 
    })
    .then((dish) => {
        console.log(dish);
        dish.comments.push({
            rating: 5,
            comment: 'I\'m getting a sinking feeling!',
            author: 'Leonardo di Carpaccio'
        });
        return dish.save();
    })
    .then((dish) => {
        console.log(dish);
        return Dishes.remove({});
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });

});

//creating a new dish
//saving the dish
//finding all the dishes in the collection
// using promises