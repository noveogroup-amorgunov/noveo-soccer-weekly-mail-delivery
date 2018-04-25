const config = require('config');
const sendEmail = require('../services/mail');
const WeatherService = require('../services/weather');
const GoogleSpreadsheetsService = require('../services/googleSpreadsheets');
const messageTemplate = require('../templates/messageTemplate.json');

const getWeatherString = async trainDay => {
    if (!config.weatherApi.isEnabled) {
        return '';
    }

    const weatherService = new WeatherService(config.weatherApi);

    return await weatherService.getByDate(trainDay);

};

const getTableData = async () => {
    const table = await GoogleSpreadsheetsService.load(config.googleTable);
    const trainDaysString = table.getTrainDaysString();
    const to = table.getEmails();
    const trainDay = table.getTrainDay();

    return { trainDaysString, to, trainDay };
};

module.exports = async () => {
    try {
        // Выгружаем данные из гугл-таблички
        const { trainDaysString, to, trainDay } = await getTableData();

        if (!trainDay) {
            console.warn('Days for playing not found, nothing delivery, sorry man');

            return false;
        }

        // Для тренировки загружаем погоду по дате/времени тренировки
        const weatherString = await getWeatherString(trainDay);

        // Формируем сообщение для рассылки
        const message = messageTemplate.content
            .replace(/{link}/g, config.googleTable.link)
            .replace('{days}', trainDaysString)
            .replace('{weather}', weatherString);

        // Отправляем email всем мамкиным футболистам
        await sendEmail({ to, mailbody: message });
    } catch (err) {
        console.error(err);
    }
};
