var express = require('express');
var router = express.Router();
var Comment = require('../controllers/comment')
var jwtMiddleware = require('../middlewares/jwt')

/* RESTFUL API */ 
// jwtMiddleware.authenticateToken
router.get('/', Comment.findAll);

router.get('/seed', Comment.seed);

router.get('/:id', Comment.findOneComment);

router.post('/', Comment.addComment);

router.put('/:id', Comment.update);

router.patch('/:id', Comment.update);

router.delete('/:id', Comment.deleteComment);


module.exports = router;
