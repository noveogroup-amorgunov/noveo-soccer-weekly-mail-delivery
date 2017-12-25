/* @flow */

import sendEmail from '../services/mail';
import GoogleSpreadsheets from '../services/googleSpreadsheets';

function getEmailMessage(days: string): string {
    return `Всем привет!<br />
    <p>Отмечаемся в гугл-доке (<a href="https://goo.gl/REKNRq">https://goo.gl/REKNRq</a>) на эту неделю (${days}) кто хочет поиграть.</p>
    <p>Как только набирается <strong>9-10 человек</strong>, мы бронируем и играем.</p><br/>
    <p>C уважением, <b>Noveo soccer weekly mail delivery</b><br><br>
    <small style="color: #999">Манеж, где играем: <a href="http://eliga.ru/booking/">http://eliga.ru/booking/</a>. Чтобы отписаться от рассылки, удалите свой email из гугл таблички из письма.</small>
    </p>
    `;
}

export default async function run() {
    try {
        const table = await GoogleSpreadsheets.load(process.env.GOOGLE_TABLE_ID || '');
        const content: string | false = table.getDayOnThisWeek();

        if (!content) {
            return false;
        }

        const to: string[] = table.getEmails();
        const mailbody: string = getEmailMessage(content);

        await sendEmail({ to, subject: 'Noveo soccer weekly mail delivery', mailbody });
    } catch (err) {
        console.error(err);
    }
}
