require('dotenv-extended').load();

const schedule = require('node-schedule');
const config = require('config');
const weeklyMailDeliveryJob = require('./commands/weeklyMailDelivery');

schedule.scheduleJob(config.deliveryCron, async () => {
    return await weeklyMailDeliveryJob();
});

process.on('SIGINT', () => {
    process.exit(0); // eslint-disable-line no-process-exit
});
