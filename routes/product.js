var express = require('express');
var router = express.Router();
var Product = require('../controllers/product')
var jwtMiddleware = require('../middlewares/jwt')

/* RESTFUL API */ 
// jwtMiddleware.authenticateToken
router.get('/', Product.findAll);

router.get('/seed', Product.seed);

router.get('/:id', Product.findOneProduct);

router.post('/', Product.addProduct);

router.put('/:id', Product.update);

router.patch('/:id', Product.update);

router.delete('/:id', Product.deleteProduct);


router.post('/login', Product.createNewUser);

router.post('/register', Product.createNewUser);


module.exports = router;
