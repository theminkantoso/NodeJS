const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        require: true
    }
},{
    timestamps: true //automatically create add and update values
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;