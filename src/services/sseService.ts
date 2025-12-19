import type { Response } from 'express';
import { once } from 'node:events';

export function setSseHeaders(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
}

export async function sseWrite(res: Response, payload: unknown) {
  const ok = res.write(`data: ${JSON.stringify(payload)}\n\n`);
  if (!ok) {
    await once(res, 'drain');
  }
}
