var express = require('express');
var router = express.Router();
var Invoice = require('../controllers/invoice')


/* RESTFUL API */ 

router.get('/', Invoice.findAll);

router.get('/seed', Invoice.seed);

router.get('/:id', Invoice.findOneInvoice);

router.post('/', Invoice.addInvoice);

router.put('/:id', Invoice.update);

router.patch('/:id', Invoice.update);

router.delete('/:id', Invoice.deleteInvoice);

module.exports = router;
