const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const config = require('../config/db.config');

const CommentSchema = new mongoose.Schema({
    id: {
        type: Number,
    },

    name: {
        type: String,
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
    },


}, {timestamps: true});


CommentSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Comment', CommentSchema);
