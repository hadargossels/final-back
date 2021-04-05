// const auth = require('./auth');
// const user = require('./user');
// const event = require('./product');
// const category = require('./category');

// const authenticate = require('../middlewares/authenticate');

// module.exports = app => {
//     app.get('/', (req, res) => {
//         res.status(200).send({ message: "Welcome to the AUTHENTICATION API. Register or Login to test Authentication."});
//     });

//     app.use('/api/auth', auth);
//     app.use('/api/user', authenticate, user);
//     app.use('/api/product', authenticate, product);
//     app.use('/api/category', authenticate, category);
// };

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader( 'Access-Control-Expose-Headers', 'Content-Range');
  res.setHeader('Content-Range', 'branches 0-20/20');
  res.render('index', { title: 'Express' });
});

module.exports = router;
