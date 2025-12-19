import type { Request, Response } from "express";


export interface ChatGenerationState {
  message: string;
  nextChunkIndex: number;
  totalChunks: number;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}
export type StreamParams = {
  request: Request;
  response: Response;
  sessionId: string;
  sessionData: ChatGenerationState;
  startIndex: number;
};