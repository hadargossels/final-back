var express = require('express');
var router = express.Router();
var Shipping = require('../controllers/shipping')
var jwtMiddleware = require('../middlewares/jwt')

/* RESTFUL API */ 
// jwtMiddleware.authenticateToken
router.get('/', Shipping.findAll);

router.get('/:id', Shipping.findOneShipping);

router.post('/', Shipping.addShipping);

router.put('/:id', Shipping.update);

router.patch('/:id', Shipping.update);

router.delete('/:id', Shipping.deleteShipping);


module.exports = router;
