require('dotenv-extended').load();

const weeklyMailDeliveryJob = require('./commands/weeklyMailDelivery');

async function r() {
    await weeklyMailDeliveryJob();
}

r();
