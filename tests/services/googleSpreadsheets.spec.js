const assert = require('assert');
const nock = require('nock');
const config = require('config');
const { readFile } = require('../utils.js');

const GoogleSpreadsheets = require('../../src/services/googleSpreadsheets');
const googleSpreadsheetsCell = require('../mocks/googleSpreadsheets.json');

const tableId = '12345';
const { url } = config.googleTable;

describe('googleSpreadsheetsService', () => {
    beforeEach(async () => {
        const mock = await readFile('mocks/googleSpreadsheetsResponse.mock');

        // Mock google spreadsheets service
        nock('https://spreadsheets.google.com/')
            .get(`/feeds/cells/${tableId}/1/public/values`)
            .query({ alt: 'json-in-script' })
            .reply(200, mock);

        // Mock date
        this._originDateNow = Date.now;
        Date.now = () => 1524554869434;
    });
    afterEach(() => {
        nock.cleanAll();

        Date.now = this._originDateNow;
    });

    it('should load cells', async () => {
        const expected = googleSpreadsheetsCell;
        const { _data: actual } = await GoogleSpreadsheets.load({ id: tableId, url });

        assert.deepEqual(expected, actual);
    });

    it('should get days for play', async () => {
        const expected = 'Вт 01/05/18 c 19:00-21:00';
        const table = await GoogleSpreadsheets.load({ id: tableId, url });
        const actual = table.getTrainDaysString();

        assert.equal(expected, actual);
    });

    it('should return false if days not found', async () => {
        Date.now = () => 1124004869434; // Some date in previous

        const expected = false;
        const table = await GoogleSpreadsheets.load({ id: tableId, url });
        const actual = table.getTrainDaysString();

        assert.equal(expected, actual);
    });

    it('should return emails', async () => {
        const expectedEmail = 'Aleksandra.Lunkova@noveogroup.com';
        const expectedLength = 28;

        const table = await GoogleSpreadsheets.load({ id: tableId, url });
        const actual = table.getEmails();

        assert.equal(expectedLength, actual.length);
        assert.equal(expectedEmail, actual[0]);
    });
});
