const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const config = require('../config/db.config');

const ProductSchema = new mongoose.Schema({
    id: {
        type: Number,
        // required: 'Event name is required',
    },

    src: {
        type: String,
        // required: 'Event name is required',
    },

    price: {
        type: String,
        // required: true
    },

    name: {
        type: String,
        // required: true
    },

    gallery1: {
        type: String,
   },

    gallery2: {
        type: String,
   },

    gallery3: {
        type: String,
   },

    description: {
        type: String,
        // required: true,
        max: 1000
    },

    stock: {
        type: String,
   },
    rating: {
        type: Number,
   },
    raters: {
        type: Number,
   },

    related1: {
        type: String,
   },

    related2: {
        type: String,
   },

    related3: {
        type: String,
   },

   category: {
        type: String,
    },

    brand: {
        type: String,
    },

    color: {
        type: String,
    },

    priceRange: {
        type: String,
    },

    date: {
        type: Date,
        // required: true,
    },

    featured: {
        type: Number,
    }

}, {timestamps: true});


// ProductSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Product', ProductSchema);
