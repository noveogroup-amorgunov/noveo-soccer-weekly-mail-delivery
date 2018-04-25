const axios = require('axios');

class Weather {
    constructor({ key, cityId, lang, units, url } = {}) {
        if (!key) {
            throw new Error('Weather.constructor: Argument `key` is required');
        }
        this._config = { key, cityId, lang, units, url };
    }

    async getByDate(date) {
        const data = await this.fetchData();

        if (!data) {
            return false;
        }

        const formattedData = this.formatData(data);
        const block = this.getForecastByDate(formattedData, date);

        return this.toLocaleString(block);
    }

    formatData(data) {
        return data.map(item => ({
            date: Number(new Date(item.dt_txt)),
            temperature: parseInt(item.main.temp, 10),
            localeWeather: item.weather.length && item.weather[0].description
        }));
    }

    async fetchData() {
        try {
            const { key, cityId, lang, units, url } = this._config;
            const params = { id: cityId, appid: key, lang, units };
            const result = await axios(url, { params });

            return result.data.list;
        } catch (err) {
            console.error(err);

            return false;
        }
    }

    toLocaleString(block) {
        if (!block) {
            return '';
        }

        return `По прогнозу будет ${block.localeWeather} (${block.temperature}°).`;
    }

    getForecastByDate(data, date) {
        const goalDate = Number(date.toDate());
        const { abs } = Math;

        const closestBlock = data.reduce((prev, curr) =>
            (abs(curr.date - goalDate) < abs(prev.date - goalDate)
                ? curr
                : prev
            ));

        return closestBlock;
    }
}

module.exports = Weather;
