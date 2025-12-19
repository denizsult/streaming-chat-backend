import type { StreamParams } from "../types/index.js";
import { LOREM_CHUNKS } from "../constants/loremChunks.js";
import { saveRedisSession } from "./sessionService.js";
import { setSseHeaders, sseWrite } from "./sseService.js";
import { logger } from "./logger.js";

export function startChatGenerationStream({
  request,
  response,
  sessionId,
  sessionData,
  startIndex,
}: StreamParams) {
  setSseHeaders(response);

  let currentIndex = startIndex;

  let streamTimeout: NodeJS.Timeout | null = null;
  let stopped = false;

  const stop = () => {
    stopped = true;
    if (streamTimeout) clearTimeout(streamTimeout);
    streamTimeout = null;
  };

  const scheduleNext = () => {
    if (stopped) return;
    streamTimeout = setTimeout(() => {
      void tick();
    }, 1000);
  };

  const tick = async () => {
    if (stopped || response.writableEnded) return;

    try {
      //* Generation finished: notify client and persist completion
      if (currentIndex >= LOREM_CHUNKS.length) {
        logger.info(`✅ Chat generation completed - Session: ${sessionId}`);

        await sseWrite(response, {
          done: true,
          message: "Chat generation completed.",
          sessionId,
        });

        await saveRedisSession(sessionId, {
          ...sessionData,
          nextChunkIndex: LOREM_CHUNKS.length,
          completed: true,
          completedAt: Date.now(),
        });

        stop();
        response.end();
        return;
      }

      const chunk = LOREM_CHUNKS[currentIndex];
      logger.info(`📤 Sending chunk ${currentIndex} - Session: ${sessionId}`);

      await sseWrite(response, {
        chunk,
        index: currentIndex,
        sessionId,
      });

      await saveRedisSession(sessionId, {
        ...sessionData,
        nextChunkIndex: currentIndex + 1,
      });

      currentIndex++;
      scheduleNext();
    } catch (error) {
      //! Any error ends the stream defensively
      logger.error("Error in chat generation stream", { error });
      stop();
      response.end();
    }
  };

  //! Client disconnect ends the stream lifecycle
  request.on("close", () => {
    stop();
    logger.info(`🔌 Client disconnected - Session: ${sessionId}`);
  });

  void tick();
}
