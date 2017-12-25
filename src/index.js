/* @flow */

import dotenv from 'dotenv-extended';
import schedule from 'node-schedule';

import weeklyMailDeliveryJob from './commands/weeklyMailDelivery';

// load enviroment variables
dotenv.load();

// every monday on 10:00
schedule.scheduleJob('00 10 * * 1', async () => {
    return weeklyMailDeliveryJob();
});


process.on('SIGINT', async () => {
    process.exit(0);
});
