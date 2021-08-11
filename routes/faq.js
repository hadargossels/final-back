var express = require('express');
var router = express.Router();
var Faq = require('../controllers/faq')

/* RESTFUL API */ 
router.get('/', Faq.findAll);

router.get('/seed', Faq.seed);

router.get('/:id', Faq.findOneFaq);

router.post('/', Faq.addFaq);

router.put('/:id', Faq.update);

router.patch('/:id', Faq.update);

router.delete('/:id', Faq.deleteFaq);


module.exports = router;
