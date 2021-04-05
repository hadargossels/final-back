const express = require('express');
const {check} = require('express-validator');

const Blog = require('../controllers/blog');

const router = express.Router();

const validate = require('../middlewares/validate');

const multer = require('multer');
const upload = multer().single('image');

//SEED
router.get('/seed', Blog.seed);

//INDEX
router.get('/', Blog.index);

//STORE
router.post('/', upload, [
    check('title').not().isEmpty().withMessage('title is required'),
    check('content').not().isEmpty().withMessage('content is required'),
], validate, Blog.store);

//SHOW
router.get('/:id',  Blog.show);

//UPDATE
router.put('/:id',  Blog.update);

//DELETE
router.delete('/:id', Blog.destroy);

module.exports = router;

