const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const config = require('../config/db.config');

const BlogSchema = new mongoose.Schema({

    title: {
        type: String,
        // required: 'Event name is required',
    },

    content: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    comments: {
        type: Number,
   },

   src: {
        type: String,
   }

}, {timestamps: true});


BlogSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Blog', BlogSchema);
