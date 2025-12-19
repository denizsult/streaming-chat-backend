import redisClient from './redisClient.js';
import { logger } from './logger.js';

//? These functions are used to gracefully shutdown the server when the user presses CTRL+C or when the server is killed

async function shutdown(signal: string) {
  logger.info(`${signal} signal received: closing HTTP server`);

  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  } catch (error) {
    logger.error('Error during shutdown', { error });
  } finally {
    process.exit(0);
  }
}

export function registerGracefulShutdown() {
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
}
