import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs'
import path from 'path';
import os from 'os';

const logDir = path.join(os.homedir(), '.zipm/log');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const transportInfo = new winston.transports.DailyRotateFile({
    level: 'info',
    filename: path.join(logDir, 'zipm-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
});

const transportError = new winston.transports.DailyRotateFile({
    level: 'error',
    filename: path.join(logDir, 'zipm-%DATE%-errors.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '30m',
    maxFiles: '20d'
});

const logg = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        transportInfo,
        transportError
        //new winston.transports.Console()
    ]
});

export default logg;
