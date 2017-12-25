require('dotenv-extended').load();
const weeklyMailDelivery = require('./commands/weeklyMailDelivery');
const schedule = require('node-schedule');

 
// every monday on 10:00
const weeklyMailDeliveryJob = schedule.scheduleJob('45 17 * * 1', async () => {
    console.log('The answer to life, the universe, and everything!');
    weeklyMailDelivery();
});