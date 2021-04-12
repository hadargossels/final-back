const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const config = require('../config/db.config');

const InvoiceSchema = new mongoose.Schema({



    id: {
        type: Number
    },

    customer_id: {
        type: Number
    },

    date: {
        type: Date
    },

    delivery_fees: {
        type: Number
    },
    

    reference: {
        type: String,
    },

    returned: {
        type: String,
    },

    status: {
        type: String,
    },

    tax_rate: {
        type: Number,
   },

   basket: {
        type: Array,
   },

   total: {
    type: Number
    },

    taxes: {
        type: Number
        },

    total_ex_taxes: {
        type: Number
        },

}, {timestamps: true});


InvoiceSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Invoice', InvoiceSchema);
