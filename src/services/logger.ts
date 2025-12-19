import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

function formatMeta(meta: Record<string, unknown>) {
  const keys = Object.keys(meta);
  if (keys.length === 0) return '';
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch {
    return ' [unserializable meta]';
  }
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    isProduction
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const msg = typeof message === 'string' ? message : JSON.stringify(message);
            return `${timestamp} ${level}: ${msg}${formatMeta(meta)}`;
          }),
        ),
  ),
});

