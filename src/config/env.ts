import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT) || 3333;
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export const SESSION_TTL_SECONDS = 60 * 60;
