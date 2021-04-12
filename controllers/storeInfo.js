let StoreInfo = require("../models/storeInfo")
let Token = require("../models/token")
let bcrypt = require('bcrypt')
const faker = require('faker');
const saltRounds = 10

exports.findAll = function (req, res) {
    StoreInfo.find({},function (err, storeInfos) {
        if (err)
            {res.send(err)
            console.log(err)}
        else {
            res.setHeader('Content-Range', `${storeInfos.length}`)
            res.send(storeInfos)
        }
    })
}


exports.addStoreInfo = function (req, res) {

    let StoreInfoData = req.body

    StoreInfo.create({...StoreInfoData}, function (err) {
        if (err)
            res.send(err)

        else
            res.json({error:false, message: 'StoreInfo Added successfully'})
    })
}

exports.findOneStoreInfo = function (req, res) {
    StoreInfo.findOne({ id: req.params.id}, function (err, storeInfos) {
        if (err)
            res.send(err)
        else{
            res.send(storeInfos)
        }
    })
}

exports.update = function (req, res) {

    let StoreInfoData = req.body

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({
            error: true,
            message: 'Please provide all required field'
        });
    } else {
        if(req.method === 'PATCH'){
            StoreInfo.patchUpdate(req.params.id, new StoreInfo({...StoreInfoData}), function (err, storeInfo) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });

                res.json({
                    error: false,
                    message: 'StoreInfo successfully updated'
                });

            });
        }else{
            StoreInfo.findOneAndUpdate({id: req.params.id}, {$set: StoreInfoData},{ useFindAndModify: false }, function (err, storeInfos) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });
                res.send(storeInfos)

            });
        }
    }
};

exports.deleteStoreInfo = function (req, res) {
    StoreInfo.findOneAndDelete({id: req.params.id},{ useFindAndModify: false }, function (err, storeInfo) {
        if (err)
            res.send({
                error: true,
                message: err.message
            });
        else

        res.json({
            error: false,
            message: 'StoreInfo successfully deleted'
        });
    });
};


