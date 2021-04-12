const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const config = require('../config/db.config');

const FaqSchema = new mongoose.Schema({
    id: {
        type: Number,
    },

    title: {
        type: String,
    },

    content: {
        type: String,
    },


}, {timestamps: true});


FaqSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Faq', FaqSchema);
