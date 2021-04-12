var express = require('express');
var router = express.Router();
var Faq = require('../controllers/faq')
var jwtMiddleware = require('../middlewares/jwt')

/* RESTFUL API */ 
// jwtMiddleware.authenticateToken
router.get('/', Faq.findAll);

router.get('/seed', Faq.seed);

router.get('/:id', Faq.findOneFaq);

router.post('/', Faq.addFaq);

router.put('/:id', Faq.update);

router.patch('/:id', Faq.update);

router.delete('/:id', Faq.deleteFaq);


module.exports = router;
