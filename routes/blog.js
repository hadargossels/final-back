var express = require('express');
var router = express.Router();
var Blog = require('../controllers/blog')

/* RESTFUL API */ 

router.get('/', Blog.findAll);

router.get('/seed', Blog.seed);

router.get('/:id', Blog.findOneBlog);

router.post('/', Blog.addBlog);

router.put('/:id', Blog.update);

router.patch('/:id', Blog.update);

router.delete('/:id', Blog.deleteBlog);


module.exports = router;
