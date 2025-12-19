import redisClient from './redisClient.js';
import { SESSION_TTL_SECONDS } from '../config/env.js';
import type { ChatGenerationState } from '../types/index.js';

function sessionKey(sessionId: string) {
  return `session:${sessionId}`;
}

export async function saveRedisSession(sessionId: string, data: ChatGenerationState) {
  await redisClient.set(sessionKey(sessionId), JSON.stringify(data), {
    EX: SESSION_TTL_SECONDS,
  });
}

export async function getRedisSession(sessionId: string): Promise<ChatGenerationState | null> {
  const raw = await redisClient.get(sessionKey(sessionId));
  if (!raw) return null;
  return JSON.parse(raw) as ChatGenerationState;
}
