/* @flow */

import axios from 'axios';
import moment from 'moment';

type Cell = {
    row: string,
    col: string,
    $t: string
}

export default class GoogleSpreadsheets {
    static urlTemplate: string = 'https://spreadsheets.google.com/feeds/cells/{id}/1/public/values?alt=json-in-script';
    _data: Cell[];

    constructor(cells: Cell[]) {
        this._data = cells;
    }

    static async load(id: string): any {
        const res = await axios(this.urlTemplate.replace('{id}', id));
        const data = JSON.parse(res.data.slice(0, res.data.length - 2).replace('gdata.io.handleScriptLoaded(', ''));
        const cells = data.feed.entry.map(cell => cell.gs$cell);
        return new GoogleSpreadsheets(cells);
    }

    getCell(row: string, col: string): ?Cell {
        return this._data.filter(cell => +cell.row === +row && +cell.col === +col)[0];
    }

    getCellByContent(content: string): ?Cell {
        return this._data.filter(cell => cell.$t === content)[0];
    }

    getRows(row: string): Cell[] {
        return this._data.filter(cell => +cell.row === +row);
    }

    getColumns(col: string): Cell[] {
        return this._data.filter(cell => +cell.col === +col);
    }

    getEmails(): string[] {
        return this.getColumns((this.getCellByContent('email'): any).col)
            .slice(1)
            .map(cell => cell.$t);
    }

    getDayOnThisWeek() {
        const days = this.getRows('1');
        const daysOnThisWeek = days.filter((d) => {
            const date = d.$t.match(/\d{2}\/\d{2}\/\d{2}/);
            if (date && date[0]) {
                const [day, month, year] = date[0].split('/');
                const matchDay = moment(`20${year}-${month}-${day}`);
                return (matchDay > moment() && matchDay < moment().add(7, 'days'));
            }
            return false;
        });

        const cols = daysOnThisWeek.map(cell => cell.col);

        return cols.length === 0 ? false : cols.map((col) => {
            const cell = this.getCell('1', col);
            return (cell: any).$t.replace('\n', ' ');
        }).join(', ');
    }
}

/* const totalPeopleComing = getCellByContent(parsed, 'Точно придут');
const totalPeopleMayBeComing = getCellByContent(parsed, 'В лучшем случае');
console.log(getCell(parsed, totalPeopleComing.row, cols[1]));
console.log(getCell(parsed, totalPeopleMayBeComing.row, cols[1])); */
