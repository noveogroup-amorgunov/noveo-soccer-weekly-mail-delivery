const assert = require('assert');
const nock = require('nock');
const moment = require('moment');
const config = require('config');

const weatherResponseMock = require('../mocks/weatherResponse.json');
const Weather = require('../../src/services/weather');

const defaultConfig = { ...config.weatherApi, key: '12345' };

describe('weatherService', () => {
    beforeEach(() => {
        // Mock weather api service
        nock('http://api.openweathermap.org/')
            .get('/data/2.5/forecast')
            .query({
                id: '1502847', // Koltsovo city, Russia,
                appid: '12345',
                lang: 'ru',
                units: 'metric'
            })
            .reply(200, weatherResponseMock);
    });
    afterEach(nock.cleanAll);

    it('should load weather', async () => {
        const weatherService = new Weather(defaultConfig);

        const expected = weatherResponseMock.list;
        const actual = await weatherService.fetchData();

        assert.deepEqual(expected, actual);
    });

    it('should find right weather block', async () => {
        const weatherService = new Weather(defaultConfig);
        const blocks = weatherService.formatData(weatherResponseMock.list);
        const currentDay = moment('2018-05-01 19:00:00');

        const [expected] = weatherService.formatData([weatherResponseMock.list[35]]);
        const actual = await weatherService.getForecastByDate(blocks, currentDay);

        assert.deepEqual(expected, actual);
    });

    it('should format weather block to locale forecast', async () => {
        const weatherService = new Weather(defaultConfig);
        const [block] = weatherService.formatData([weatherResponseMock.list[35]]);

        const expected = 'По прогнозу будет легкий дождь (8°).';
        const actual = await weatherService.toLocaleString(block);

        assert.equal(expected, actual);
    });
});
