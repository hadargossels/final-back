var express = require('express');
var router = express.Router();
var StoreInfo = require('../controllers/storeInfo')


/* RESTFUL API */ 

router.get('/', StoreInfo.findAll);

router.get('/:id', StoreInfo.findOneStoreInfo);

router.post('/', StoreInfo.addStoreInfo);

router.put('/:id', StoreInfo.update);

router.patch('/:id', StoreInfo.update);

router.delete('/:id', StoreInfo.deleteStoreInfo);


module.exports = router;
