module.exports = {

    /**
     * Запускаем каждую пятницу в 10:00
     * @see https://crontab.guru/#00_10_*_*_5
     */
    deliveryCron: '00 10 * * 5',
    daysPeriodForSearchTrain: 7,
    googleTable: {
        id: process.env.GOOGLE_TABLE_ID,
        link: process.env.GOOGLE_TABLE_SHORT_LINK,
        url: 'https://spreadsheets.google.com/feeds/cells/{id}/1/public/values?alt=json-in-script'
    },
    weatherApi: {
        isEnabled: process.env.ENABLE_WEATHER === '1',
        key: process.env.OPEN_WEATHER_API_KEY,
        cityId: process.env.OPEN_WEATHER_API_CITY || '1502847', // Koltsovo city, Russia
        lang: 'ru',
        units: 'metric',
        url: 'http://api.openweathermap.org/data/2.5/forecast'
    },
    mail: {
        email: process.env.MAIL_EMAIL,
        password: process.env.MAIL_PASSWORD,
        subject: '⚽️ Футбольная рассылка (Кольцово)',
        from: `"Noveo soccer" <${process.env.MAIL_EMAIL}>`
    }
};
