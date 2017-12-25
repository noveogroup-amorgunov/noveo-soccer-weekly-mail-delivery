'use strict';

var _dotenvExtended = require('dotenv-extended');

var _dotenvExtended2 = _interopRequireDefault(_dotenvExtended);

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _weeklyMailDelivery = require('./commands/weeklyMailDelivery');

var _weeklyMailDelivery2 = _interopRequireDefault(_weeklyMailDelivery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// load enviroment variables
_dotenvExtended2.default.load();

// every monday on 10:00


_nodeSchedule2.default.scheduleJob('00 10 * * 1', async () => {
    return (0, _weeklyMailDelivery2.default)();
});

process.on('SIGINT', async () => {
    process.exit(0);
});