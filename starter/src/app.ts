import Fastify from "fastify";
import { readGuidanceTemplate } from "./config/promptTemplate.js";
import { RecordManager } from "./managers/recordManager.js";
import { recordRoutes } from "./routes/recordRoutes.js";
import { createAuditLogger } from "./security/audit.js";
import {
  InMemoryRecordRepository,
  InMemoryShareTokenStore,
  RedisShareTokenStore,
  type ShareTokenStore,
} from "./storage/recordRepository.js";
import { createLogger } from "./utils/logger.js";

async function main() {
  const app = Fastify({ logger: false });
  const logger = createLogger();
  const shareTokenStore: ShareTokenStore =
    process.env.USE_REDIS_FOR_SHARES === "true"
      ? new RedisShareTokenStore()
      : new InMemoryShareTokenStore();

  const manager = new RecordManager(
    new InMemoryRecordRepository(shareTokenStore),
    logger,
    createAuditLogger(),
    readGuidanceTemplate(),
  );

  await app.register(recordRoutes, { manager, logger });

  await app.listen({ host: "0.0.0.0", port: 5050 });
  logger.info("server_started", { port: 5050 });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
