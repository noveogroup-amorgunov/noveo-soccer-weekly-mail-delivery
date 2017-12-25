const nodemailer = require('nodemailer');

module.exports = function mail({ from = `"Noveo soccer" <${process.env.MAIL_EMAIL}>`, to, subject, mailbody }) {
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.MAIL_EMAIL, pass: process.env.MAIL_PASSWORD }
    });

    return new Promise((resolve, reject) => {
        const mailOptions = { from, to, subject, html: mailbody };

        return smtpTransport.sendMail(mailOptions, (err) => {
            if (err) { return reject(err); }

            smtpTransport.close();
            resolve();
        });

    });
};
