const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const User = require('../controllers/user');

const router = express.Router();


//INDEX
router.get('/', User.index);

//STORE
router.post('/', User.store);

//SHOW
router.get('/:id',  User.show);

//UPDATE
router.put('/:id', User.update);

//DELETE
router.delete('/:id', User.destroy);

router.get('/seed', User.seed);

module.exports = router;


