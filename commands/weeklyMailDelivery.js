const sendEmail = require('../services/mail');
const GoogleSpreadsheets = require('../services/googleSpreadsheets');


function getEmailMessage(dates) {
    return `Всем привет!<br />
    <p>Отмечаемся в гугл-доке (<a href="https://goo.gl/REKNRq">https://goo.gl/REKNRq</a>) на эту неделю (${dates}) кто хочет поиграть.<br/>
    Как только набирается <strong>9-10 человек</strong>, мы бронируем и играем.</p><br/>
    <p>C уважением, <b>Noveo soccer weekly mail delivery</b><br><br>
    <small style="color: #999">Манеж, где играем: <a href="http://eliga.ru/booking/">http://eliga.ru/booking/</a>. Чтобы отписаться от рассылки, удалите свой email из гугл таблички из письма.</small>
    </p>
    `;
}

async function run() {
    try {
        const table = await GoogleSpreadsheets.load(process.env.GOOGLE_TABLE_ID);
        const content = table.getDayOnThisWeek();

        if (!content) {
            return false;
        }

        const to = table.getEmails();

        await sendEmail({ to, subject: 'Noveo soccer weekly mail delivery', mailbody: getEmailMessage(content) });
    } catch (err) {
        console.error(err);
    }
}

module.exports = run;
