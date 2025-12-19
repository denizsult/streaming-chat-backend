import { createClient } from 'redis';
import { REDIS_URL } from '../config/env.js';
import { logger } from './logger.js';

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on('error', (err) =>
  logger.error('❌ Redis Error', { err })
);

redisClient.on('connect', () =>
  logger.info('✅ Redis connected')
);

await redisClient.connect();

export default redisClient;
