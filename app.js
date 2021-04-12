var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
require('dotenv').config();

var authRouter = require('./routes/auth');
var productRouter = require('./routes/product');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var blogRouter = require('./routes/blog');
var commentRouter = require('./routes/comment');
var invoiceRouter = require('./routes/invoice');
var faqRouter = require('./routes/faq');
var shippingRouter = require('./routes/shipping');
var storeInfoRouter = require('./routes/storeInfo');
var mailRouter = require('./routes/mail');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range')
  next()
})

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.use('/comment', commentRouter);
app.use('/invoice', invoiceRouter);
app.use('/storeInfo', storeInfoRouter);
app.use('/faq', faqRouter);
app.use('/shipping', shippingRouter);
app.use('/mail', mailRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
