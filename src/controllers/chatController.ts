import type { Request, Response } from "express";
import { chatRequestSchema } from "../validations/index.js";
import type { ChatGenerationState } from "../types/index.js";
import { LOREM_CHUNKS } from "../constants/loremChunks.js";
import {
  getRedisSession,
  saveRedisSession,
} from "../services/sessionService.js";
import { startChatGenerationStream } from "../services/chatStreamService.js";
import { logger } from "../services/logger.js";
import { parseIndexParam, resolveResumeIndex } from "../utils/index.js";

export async function postChatMessage(req: Request, res: Response) {
  try {
    const validatedData = chatRequestSchema.parse(req.body);
    const { sessionId, message } = validatedData;

    if (await getRedisSession(sessionId)) {
      res.status(409).json({ error: "Session already exists" });
      return;
    }

    logger.info(`📩 New chat generation request - Session: ${sessionId}`);

    const sessionData: ChatGenerationState = {
      message,
      nextChunkIndex: 0,
      totalChunks: LOREM_CHUNKS.length,
      completed: false,
      createdAt: Date.now(),
    };

    await saveRedisSession(sessionId, sessionData);

    // * Initiate chat generation, SSE connection will be established separately
    res.status(201).json({
      ok: true,
      sessionId,
      totalChunks: sessionData.totalChunks,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Bir hata oluştu" });
    }
  }
}

export async function streamChat(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;

    logger.info(`🔄 SSE reconnection request - Session: ${sessionId}`);

    //? check if the fromIndex and lastIndex are valid numbers
    const clientFromIndex = parseIndexParam(req.query.fromIndex);
    const clientLastIndex = parseIndexParam(req.query.lastIndex);

    const sessionData = await getRedisSession(sessionId);

    if (!sessionData) {
      res.status(404).json({
        error: "Chat generation session not found or expired",
      });
      return;
    }

    /* check if the session is completed */
    if (sessionData.completed) {
      res.status(200).json({
        error: "Chat generation session completed",
      });
      return;
    }

    //? resolve the resume index
    const resumeFromIndex = resolveResumeIndex({
      storedNextIndex: sessionData.nextChunkIndex,
      clientFromIndex,
      clientLastIndex,
    });

    logger.info(
      `▶️ Resuming chat generation from index ${resumeFromIndex} - Session: ${sessionId}`
    );

    startChatGenerationStream({
      request: req,
      response: res,
      sessionId,
      sessionData,
      startIndex: resumeFromIndex,
    });
  } catch (error) {
    logger.error("SSE reconnection error", { error });
    res.status(500).json({ error: "Bir hata oluştu" });
  }
}
