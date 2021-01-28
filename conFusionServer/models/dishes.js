const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose); //load new currency type to mongoose
const Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        //reference to the ID of the user document
        type: mongoose.Schema.Types.ObjectId, //reference to the user documents
        ref: 'User'
    }
},{
        timestamps: true //automatically create add and update values
},{
    usePushEach:true
});

var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: '' //specify a default value
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema] //sub-document
},{
    timestamps: true //automatically create add and update values 
},{
    usePushEach:true //ERROR FIXING
});




var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;