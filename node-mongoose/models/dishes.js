const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        require: true
    },
    comment: {
        type: String,
        require: true
    },
    author: {
        type: String,
        required: true
    }
},{
        timestamps: true //automatically create add and update values
});

var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        require: true
    },
    comments: [commentSchema] //sub-document
},{
    timestamps: true //automatically create add and update values
    
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;