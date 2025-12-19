import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import {
  postChatMessage,
  streamChat,
} from "./controllers/chatController.js";
import { getHealth } from "./controllers/healthController.js";
import { registerGracefulShutdown } from "./services/gracefulShutdown.js";
import { logger } from "./services/logger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", postChatMessage);
app.get("/chat/stream/:sessionId", streamChat);
app.get("/health", getHealth);


registerGracefulShutdown();

app.listen(PORT, () => {
  logger.info(`🚀 Backend server running on http://localhost:${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
});
