const axios = require('axios');
const moment = require('moment');

const urlTemplate = 'https://spreadsheets.google.com/feeds/cells/{id}/1/public/values?alt=json-in-script'

class GoogleSpreadsheets {
    constructor(cells) {
        this._data = cells;
    }
    static async load(id) {
        const res = await axios(urlTemplate.replace('{id}', id));
        const data = JSON.parse(res.data.slice(0, res.data.length - 2).replace('gdata.io.handleScriptLoaded(', ''));
        const cells = data.feed.entry.map(cell => cell.gs$cell);
        return new GoogleSpreadsheets(cells);
    }

    getCell(row, col) { return this._data.filter(cell => +cell.row === +row && +cell.col === +col)[0]; }
    getCellByContent(content) { return this._data.filter(cell => cell.$t === content)[0]; }
    getRows(row) { return this._data.filter(cell => +cell.row === +row); }
    getColumns(col) { return this._data.filter(cell => +cell.col === +col); }

    getEmails() {
        return this.getColumns(this.getCellByContent('email').col).slice(1).map(cell => cell.$t).join(', ');
    }
    getDayOnThisWeek() {
        const days = this.getRows(1);
        const daysOnThisWeek = days.filter(day => {
            const date = day.$t.match(/\d{2}\/\d{2}\/\d{2}/);
            if (date && date[0]) {
                const [day, month, year] = date[0].split('/');
                const d = moment(`20${year}-${month}-${day}`);
                return (d > moment() && d < moment().add(7, 'days'));
            }
            return false;
        });

        const cols = daysOnThisWeek.map(cell => cell.col);

        return cols.length === 0 ? false : cols.map(col => {
            const cell = this.getCell(1, col);
            return cell.$t.replace('\n', ' ');
        }).join(', ');
    }
}

module.exports = GoogleSpreadsheets;

/* const totalPeopleComing = getCellByContent(parsed, 'Точно придут');
const totalPeopleMayBeComing = getCellByContent(parsed, 'В лучшем случае');
console.log(getCell(parsed, totalPeopleComing.row, cols[1]));
console.log(getCell(parsed, totalPeopleMayBeComing.row, cols[1])); */