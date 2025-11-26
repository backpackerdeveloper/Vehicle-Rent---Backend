import 'dotenv/config';
import app from './app';
import env from './config/env';
import logger from './config/logger';
import prisma from './config/prismaClient';
import { setupWorkers, startScheduledJobs } from './jobs/workers';

setupWorkers();
startScheduledJobs();

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`API Documentation: http://localhost:${env.PORT}/docs`);
});

const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');
  server.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    logger.info('Database disconnected');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default server;

