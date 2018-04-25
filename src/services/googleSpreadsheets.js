const axios = require('axios');
const moment = require('moment');
const config = require('config');

class GoogleSpreadsheets {
    constructor(cells) {
        this._data = cells;
    }

    static async load({ id, url }) {
        if (!id) {
            throw new Error('GoogleSpreadsheets.load: Argument `id` is required');
        }
        const result = await axios(url.replace('{id}', id));
        const json = result.data
            .slice(0, result.data.length - 2)
            .replace('gdata.io.handleScriptLoaded(', '');
        const data = JSON.parse(json);

        const cells = data.feed.entry
            .map(cell => cell.gs$cell)
            .map(cell => {
                const formattedCell = {
                    $t: cell.$t,
                    row: Number(cell.row),
                    col: Number(cell.col)
                };

                if (cell.numericValue) {
                    formattedCell.numericValue = cell.numericValue;
                }

                return formattedCell;
            });

        return new GoogleSpreadsheets(cells);
    }

    getCell(row, col) {
        return this._data.filter(cell => cell.row === row && cell.col === col)[0];
    }

    getCellByContent(content) {
        return this._data.filter(cell => cell.$t === content)[0];
    }

    getRows(row) {
        return this._data.filter(cell => cell.row === row);
    }

    getColumns(col) {
        return this._data.filter(cell => cell.col === col);
    }

    getEmails() {
        return this.getColumns(this.getCellByContent('email').col)
            .slice(1)
            .map(cell => cell.$t);
    }

    getTrainDay() {
        const trainDays = this.getTrainDays();

        return trainDays.length && trainDays[0].date;
    }

    getTrainDaysString() {
        const trainDays = this.getTrainDays();

        return trainDays.length === 0 ? false : trainDays
            .map(cell => cell.$t.replace('\n', ' '))
            .join(', ');
    }

    getTrainDays() {
        const days = this.getRows(1);
        const period = config.daysPeriodForSearchTrain;

        const trainDays = days.map(d => {
            const date = d.$t.match(/\d{2}\/\d{2}\/\d{2}/);

            if (date && date[0]) {
                const [day, month, year] = date[0].split('/');
                const matchDay = moment(`20${year}-${month}-${day}`);
                const isTruthDay = (matchDay > moment() && matchDay < moment().add(period, 'days'));

                // @TODO: Парсить начало тренировки из таблички
                return isTruthDay && { ...d, date: matchDay.hour(19) };
            }

            return false;
        }).filter(Boolean);

        if (trainDays.length === 0) {
            console.warn('Days for playing not found, nothing delivery, sorry man');
        }

        return trainDays;
    }
}

module.exports = GoogleSpreadsheets;
