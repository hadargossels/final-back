const nodemailer = require("nodemailer")

const transport = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
        user: process.env.THE_MAIL,
        pass: process.env.THE_MAIL_PASSWORD
    }
}

const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success)=> {
    if(error)
        console.log(error)
    else
        console.log("ready to send mails")
})


module.exports = transporter