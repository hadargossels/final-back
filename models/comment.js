const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const config = require('../config/db.config');

const CommentSchema = new mongoose.Schema({
    commentId: {
        type: Number,
        // required: 'Event name is required',
    },

    name: {
        type: String,
        // required: 'Event name is required',
    },

    date: {
        type: Date,
        required: true
    },

    comment: {
        type: String,
        required: true
    },

    postId: {
        type: Number,
        // required: 'Event name is required',
    },


}, {timestamps: true});


CommentSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Comment', CommentSchema);
