const fs = require('fs');
const path = require('path');

const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}], ${req.method}, ${req.url}\n`;

    console.log(log);
}