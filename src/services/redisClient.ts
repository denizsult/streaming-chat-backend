import { createClient, RedisClientType } from 'redis';
import { REDIS_URL } from '../config/env.js';
import { logger } from './logger.js';

const redisClient: RedisClientType = createClient({
  url: REDIS_URL,
}) as RedisClientType;

redisClient.on('error', (err: Error) => logger.error('❌ Redis Error', { err }));
redisClient.on('connect', () => logger.info('✅ Redis connected'));

await redisClient.connect();

export default redisClient;
