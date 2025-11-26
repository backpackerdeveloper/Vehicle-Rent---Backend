import pinoHttp from 'pino-http';
import logger from '../config/logger';

export const requestLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => req.url?.includes('/health') || false,
  },
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    }
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
});

