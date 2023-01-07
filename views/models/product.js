const mongoose = require('mongoose');
//const { Schema } = mongoose;



const farmProductSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    category:{
        type: String,
        enum: ['fruit', 'vegetable', 'dairy']
    }
});



const FarmProduct = mongoose.model('FarmProduct',farmProductSchema);
module.exports = FarmProduct;

