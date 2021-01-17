const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log('Connected correctly to server');

    var newDish = Dishes({
        name: 'Uthappizza',
        description: 'test'
    });

    newDish.save()
        .then((dish) => {
            console.log(dish); // save the newDish

            return Dishes.find({}).exec(); 
            //find all the dishes. exec: ensure this is executed, return a promise
            //that promise can be returned so it can be chained the method to the remaining ones

        })
        .then((dishes) => {
            console.log(dishes);

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