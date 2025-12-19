import type { Request, Response } from 'express';
import redisClient from '../services/redisClient.js';

export function getHealth(req: Request, res: Response) {
  res.json({
    status: 'ok',
    redis: redisClient.isOpen,
    timestamp: new Date().toISOString(),
  });
}
