import { createServer } from 'http';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { initSockets } from './sockets/index.js';
import { startWorkers } from './workers/index.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const httpServer = createServer(app);

  initSockets(httpServer);

  try {
    startWorkers();
  } catch (error) {
    logger.warn({ error }, 'BullMQ workers initialization skipped (Redis unavailable in standalone mode)');
  }

  httpServer.listen(env.PORT, () => {
    logger.info(`🚀 BugLens AI Backend listening on http://localhost:${env.PORT}`);
    logger.info(`📡 Socket.IO server initialized`);
    logger.info(`🤖 AI Service linked at: ${env.AI_SERVICE_URL}`);
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
