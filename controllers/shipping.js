let Shipping = require("../models/shipping")
let Token = require("../models/token")
let bcrypt = require('bcrypt')
const faker = require('faker');
const saltRounds = 10

exports.findAll = function (req, res) {
    Shipping.find({},function (err, shippings) {
        if (err)
            {res.send(err)
            console.log(err)}
        else {
            res.setHeader('Content-Range', `${shippings.length}`)
            res.send(shippings)
        }
    })
}


exports.addShipping = function (req, res) {

    let ShippingData = req.body

    Shipping.create({...ShippingData}, function (err) {
        if (err)
            res.send(err)

        else
            res.json({error:false, message: 'Shipping Added successfully'})
    })
}

exports.findOneShipping = function (req, res) {
    Shipping.findOne({ id: req.params.id}, function (err, shippings) {
        if (err)
            res.send(err)
        else{
            res.send(shippings)
        }
    })
}

exports.update = function (req, res) {

    let ShippingData = req.body

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({
            error: true,
            message: 'Please provide all required field'
        });
    } else {
        if(req.method === 'PATCH'){
            Shipping.patchUpdate(req.params.id, new Shipping({...ShippingData}), function (err, shipping) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });

                res.json({
                    error: false,
                    message: 'Shipping successfully updated'
                });

            });
        }else{
            Shipping.findOneAndUpdate({id: req.params.id}, {$set: ShippingData},{ useFindAndModify: false }, function (err, shippings) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });
                res.send(shippings)

            });
        }
    }
};

exports.deleteShipping = function (req, res) {
    Shipping.findOneAndDelete({id: req.params.id},{ useFindAndModify: false }, function (err, shipping) {
        if (err)
            res.send({
                error: true,
                message: err.message
            });
        else

        res.json({
            error: false,
            message: 'Shipping successfully deleted'
        });
    });
};
