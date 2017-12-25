'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mail;

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getDefaultFrom = () => `"Noveo soccer" <${process.env.MAIL_EMAIL || ''}>`;

function mail({ from = getDefaultFrom(), to, subject, mailbody }) {
    const smtpTransport = _nodemailer2.default.createTransport({
        service: 'gmail',
        auth: { user: process.env.MAIL_EMAIL, pass: process.env.MAIL_PASSWORD }
    });

    return new Promise((resolve, reject) => {
        const mailOptions = { from, to: to.join(', '), subject, html: mailbody };

        return smtpTransport.sendMail(mailOptions, err => {
            if (err) {
                return reject(err);
            }

            smtpTransport.close();
            resolve();
        });
    });
}