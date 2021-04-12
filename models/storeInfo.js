const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const config = require('../config/db.config');

const StoreInfoSchema = new mongoose.Schema({
    id: {
        type: Number
    },

    name: {
        type: String
    },

    address: {
        type: String
    },

    phone: {
        type: String
    },

    email: {
        type: String
    },

    opening: {
        type: String
    },

    about: {
        type: String
    },

    facebook: {
        type: String
    },

    instagram: {
        type: String
    },

    twitter: {
        type: String
    },

}, {timestamps: true});


StoreInfoSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('StoreInfo', StoreInfoSchema);
