const fs = require('fs');
const path = require('path');

module.exports = {
    readFile: fileName => new Promise((resolve, reject) =>
        fs.readFile(path.join(__dirname, fileName), (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.toString());
        }))
};
