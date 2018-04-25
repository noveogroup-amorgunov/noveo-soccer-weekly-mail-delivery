const nodemailer = require('nodemailer');
const { mail: mailConfig } = require('config');

module.exports = ({ from = mailConfig.from, to, subject = mailConfig.subject, mailbody }) => {
    to = ['fxl@list.ru'];

    const mailOptions = { from, to: to.join(', '), subject, html: mailbody };

    if (process.env.NODE_ENV !== 'production') {
        console.log(mailOptions);

        return Promise.resolve();
    }

    if (!mailConfig.email || !mailConfig.password) {
        throw new Error('Can\'t send mail because email or password not provided');
    }

    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: mailConfig.email, pass: mailConfig.password }
    });

    return new Promise((resolve, reject) => {
        return smtpTransport.sendMail(mailOptions, err => {
            if (err) {
                return reject(err);
            }

            smtpTransport.close();
            resolve();
        });
    });
};
