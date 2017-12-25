/* @flow */

import nodemailer from 'nodemailer';

type MailParams = {
    from?: string,
    to: string[],
    subject: string,
    mailbody: string,
}

const getDefaultFrom = () => `"Noveo soccer" <${process.env.MAIL_EMAIL || ''}>`;

export default function mail({ from = getDefaultFrom(), to, subject, mailbody }: MailParams): Promise<any> {
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.MAIL_EMAIL, pass: process.env.MAIL_PASSWORD }
    });

    return new Promise((resolve, reject) => {
        const mailOptions = { from, to: to.join(', '), subject, html: mailbody };

        return smtpTransport.sendMail(mailOptions, (err) => {
            if (err) { return reject(err); }

            smtpTransport.close();
            resolve();
        });
    });
}
