var express = require('express');
var router = express.Router();
var transporter = require('../config/mail.conf')

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('gettting mail route');
});

router.post('/sendMailToClient', function (req, res, next) {

    console.log(req.body)

    const to = req.body.from
    const subject = req.body.subject
    const text = req.body.text

    const mail = {
        from: process.env.THE_MAIL,
        to,
        subject,
        text
    }

    transporter.sendMail(mail, (err, data)=>{
        if(err)
            res.json({
                status: 'failed',
                message: err.message
            })
        else
            res.json({
                status:'success'
            })
    })

});


router.post('/sendMailFromClient', function (req, res, next) {

    console.log(req.body)

    const from = req.body.from
    const name = req.body.name
    const subject = req.body.subject
    const text = req.body.text

    const mail = {
        from: from,
        to: process.env.THE_MAIL,
        subject,
        text:`
        mail from ${from}
        name: ${name}
        subject: ${subject}
        content: ${text}
        `,
        // html: `<h1>mail from ${from}</h1>`
    }
    transporter.sendMail(mail, (err, data) => {
        if (err)
            res.json({
                status: 'failed',
                message: err.message
            })
        else
            res.json({
                status: 'success'
            })
    })

});



module.exports = router;