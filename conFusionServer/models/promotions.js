const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//load new currency type to mongoose
require('mongoose-currency').loadType(mongoose); 

const Currency = mongoose.Types.Currency;

var promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
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
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true //automatically create add and update values 
},{
    usePushEach:true //ERROR FIXING
});

var Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;

