const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendEmail = asyncHandler(async (data, req, res) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD
        }
    });

    // async..await is not allowed in global scope, must use a wrapper

    const info = await transporter.sendMail({
        from: '"Hey👻" <digitic@gmail.com>', // sender address
        to: data.to,
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.html, // html body
    }, (error, info) => {
        if (error) {
            console.log('error occured! :', error);
        } else {
            console.log("EMAIL SENT! ", info.response)
        }
    });





})

module.exports = sendEmail;