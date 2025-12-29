const fs = require('fs');
const path = require('path');

const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const log = `Time: [${timestamp}], Method: ${req.method}, URL: ${req.url}, IP: ${req.ip}\n`;

    console.log(log);

    fs.appendFile(path.join(__dirname, '..', 'logs', 'server.log'), log, (err) => {
        if (err) {console.error('Logging Failed', err);}
    });

    next();
};

module.exports = logger;