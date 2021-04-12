let Invoice = require("../models/invoice")
let Token = require("../models/token")
let bcrypt = require('bcrypt')
const faker = require('faker');
const saltRounds = 10

exports.findAll = function (req, res) {
    Invoice.find({},function (err, invoices) {
        if (err)
            {res.send(err)
            console.log(err)}
        else {
            res.setHeader('Content-Range', `${invoices.length}`)
            res.send(invoices)
        }
    })
}


exports.addInvoice = function (req, res) {

    let InvoiceData = req.body

    Invoice.create(InvoiceData, function (err) {
        if (err)
            res.send(err)

        else
            res.json({error:false, message: 'Invoice Added successfully'})
    })
}

exports.findOneInvoice = function (req, res) {
    Invoice.findOne({ id: req.params.id}, function (err, invoices) {
        if (err)
            res.send(err)
        else{
            res.send(invoices)
        }
    })
}

exports.update = function (req, res) {

    let InvoiceData = req.body

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({
            error: true,
            message: 'Please provide all required field'
        });
    } else {
        if(req.method === 'PATCH'){
            Invoice.patchUpdate(req.params.id, new Invoice(InvoiceData), function (err, invoice) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });

                res.json({
                    error: false,
                    message: 'Invoice successfully updated'
                });

            });
        }else{
            Invoice.findOneAndUpdate({id: req.params.id}, {$set: InvoiceData},{ useFindAndModify: false }, function (err, invoices) {
                if (err)
                    return res.send({
                        error: true,
                        message: err.message
                    });
                res.send(invoices)

            });
        }
    }
};

exports.deleteInvoice = function (req, res) {
    Invoice.findOneAndDelete({id: req.params.id},{ useFindAndModify: false }, function (err, invoice) {
        if (err)
            res.send({
                error: true,
                message: err.message
            });
        else

        res.json({
            error: false,
            message: 'Invoice successfully deleted'
        });
    });
};


exports.seed = async function (req, res) {

    try {
        let Invoices = [];
            for (let j = 0; j < 50; j++) {
                let newInvoice = new Invoice({
                    id: j,
                    customer_id: faker.datatype.number(15),
                    date: faker.date.past(),
                    delivery_fees: faker.datatype.float(10),
                    reference: faker.random.word(),
                    returned: faker.datatype.boolean(),
                    status: faker.random.arrayElement(["delivered", "canceled", "ordered"]),
                    tax_rate: 0.18,
                    basket: [{product_id: faker.datatype.number(50), quantity: faker.datatype.number(7)}],
                    total: faker.datatype.float(100),
                    taxes: faker.datatype.float(10),
                    total_ex_taxes: faker.datatype.float(100),
                });
                let invoice = await newInvoice.save();
                Invoices.push(invoice);
            }
        

        res.status(200).json({Invoices, message: 'Database seeded!'});
    } catch (error) {
        res.status(500).json({message: "seed error " + error.message});
    }

};
