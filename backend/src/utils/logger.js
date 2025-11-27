const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Vercel / serverless file system is read-only except for /tmp,
// so avoid creating log files there and prefer console logging.
const isServerless = !!process.env.VERCEL;

const transports = [];

if (!isServerless) {
  const logsDir = path.join(__dirname, '../../logs');

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log')
    })
  );
}

// Always log to console so Vercel captures logs,
// and for local development convenience.
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      process.env.NODE_ENV === 'production'
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
    )
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports
});

module.exports = logger;
