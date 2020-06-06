const nodemailer = require("nodemailer");
const fs = require("fs");
const template = fs.readFileSync('./templates/test.html')
const csv = require('csvtojson')
let emails = [];
csv()
    .fromFile('./Data.csv')
    .then((json) => {
        json.forEach(obj => emails.push(obj.Emails))
        main().catch(console.error);
    })

async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //   let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: "",
        port: 587,
        secure: false, // true for 465, false for other ports
        tls: {
            minVersion: "TLSv1",
            rejectUnauthorized: false,
            ignoreTLS: false,
            requireTLS: true
        },
        auth: {
            user: '',
            pass: '',
        },
    });

    await test(transporter)

    // send mail with defined transport object
}
async function test(transporter) {
    if (emails.length !== 0) {
        let info = await transporter.sendMail({
            from: "", // sender address
            to: emails[0], // list of receivers
            subject: "Hello ✔", // Subject line
            // text: "Hello world?", // plain text body
            html: template.toString(), // html body
        });
        emails.shift()
        test(transporter)
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
}
// main().catch(console.error);