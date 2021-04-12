const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const config = require('../config/db.config');

const ShippingSchema = new mongoose.Schema({
    id: {
        type: Number,
    },

    region: {
        type: String,
    },

    cost: {
        type: String,
    },

    estimatedTime: {
        type: String,
    },

    service: {
        type: String,
    }


}, {timestamps: true});


ShippingSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Shipping', ShippingSchema);
