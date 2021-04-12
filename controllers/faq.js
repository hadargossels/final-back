let Faq = require("../models/faq")
let Token = require("../models/token")
let bcrypt = require('bcrypt')
const faker = require('faker');
const saltRounds = 10

exports.findAll = function (req, res) {
    Faq.find({},function (err, faqs) {
        if (err)
            {res.send(err)
            console.log(err)}
        else {
            res.setHeader('Content-Range', `${faqs.length}`)
            res.send(faqs)
        }
    })
}


exports.addFaq = function (req, res) {

    let FaqData = req.body

    Faq.create({...FaqData}, function (err) {
        if (err)
            res.send(err)

        else
            res.json({error:false, message: 'Faq Added successfully'})
    })
}

exports.findOneFaq = function (req, res) {
    Faq.findOne({ id: req.params.id}, function (err, faqs) {
        if (err)
            res.send(err)
        else{
            res.send(faqs)
        }
    })
}

exports.update = function (req, res) {

    let FaqData = req.body

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({
            error: true,
            message: 'Please provide all required field'
        });
    } else {
        if(req.method === 'PATCH'){
            Faq.patchUpdate(req.params.id, new Faq({...FaqData}), function (err, faq) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });

                res.json({
                    error: false,
                    message: 'Faq successfully updated'
                });

            });
        }else{
            Faq.findOneAndUpdate({id: req.params.id}, {$set: FaqData},{ useFindAndModify: false }, function (err, faqs) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });
                res.send(faqs)

            });
        }
    }
};

exports.deleteFaq = function (req, res) {
    Faq.findOneAndDelete({id: req.params.id},{ useFindAndModify: false }, function (err, faq) {
        if (err)
            res.send({
                error: true,
                message: err.message
            });
        else

        res.json({
            error: false,
            message: 'Faq successfully deleted'
        });
    });
};

exports.seed = async function (req, res) {

    try {
        let Faqs = [];
            for (let j = 0; j < 8; j++) {
                let newFaq = new Faq({
                    id: j,
                    title: faker.lorem.words(4),
                    content: faker.lorem.sentences(2),             
                });
                let faq = await newFaq.save();
                Faqs.push(faq);
            }
        

        res.status(200).json({Faqs, message: 'Database seeded!'});
    } catch (error) {
        res.status(500).json({message: "seed error " + error.message});
    }

};
