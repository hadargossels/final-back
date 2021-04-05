const express = require('express');
const {check} = require('express-validator');

const Comment = require('../controllers/comment');

const router = express.Router();

const validate = require('../middlewares/validate');

const multer = require('multer');
const upload = multer().single('image');

//SEED
router.get('/seed', Comment.seed);

//INDEX
router.get('/', Comment.index);

//STORE
router.post('/', upload, [
    check('name').not().isEmpty().withMessage('Name is required')
], validate, Comment.store);

//SHOW
router.get('/:id',  Comment.show);

//UPDATE
router.put('/:id',  Comment.update);

//DELETE
router.delete('/:id', Comment.destroy);

module.exports = router;

