'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mail = require('../services/mail');

var _mail2 = _interopRequireDefault(_mail);

var _googleSpreadsheets = require('../services/googleSpreadsheets');

var _googleSpreadsheets2 = _interopRequireDefault(_googleSpreadsheets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getEmailMessage(days) {
    return `Всем привет!<br />
    <p>Отмечаемся в гугл-доке (<a href="https://goo.gl/REKNRq">https://goo.gl/REKNRq</a>) на эту неделю (${days}) кто хочет поиграть.</p>
    <p>Как только набирается <strong>9-10 человек</strong>, мы бронируем и играем.</p><br/>
    <p>C уважением, <b>Noveo soccer weekly mail delivery</b><br><br>
    <small style="color: #999">Манеж, где играем: <a href="http://eliga.ru/booking/">http://eliga.ru/booking/</a>. Чтобы отписаться от рассылки, удалите свой email из гугл таблички из письма.</small>
    </p>
    `;
}

exports.default = async function run() {
    try {
        const table = await _googleSpreadsheets2.default.load(process.env.GOOGLE_TABLE_ID || '');
        const content = table.getDayOnThisWeek();

        if (!content) {
            return false;
        }

        const to = table.getEmails();
        const mailbody = getEmailMessage(content);

        await (0, _mail2.default)({ to, subject: 'Noveo soccer weekly mail delivery', mailbody });
    } catch (err) {
        console.error(err);
    }
};