import type { FastifyInstance } from "fastify";
import { RecordManager } from "../managers/recordManager.js";
import { requireUser, type RequestWithUser } from "../security/auth.js";
import type { AppLogger } from "../utils/logger.js";

export async function recordRoutes(
  fastify: FastifyInstance,
  opts: { manager: RecordManager; logger: AppLogger },
) {
  const { manager, logger } = opts;

  fastify.addHook("preHandler", requireUser);

  fastify.get("/records/:recordId", async (request, reply) => {
    try {
      const { recordId } = request.params as { recordId: string };
      const user = (request as RequestWithUser).user;
      return reply.send(await manager.getRecord(recordId, user));
    } catch (err) {
      logger.error("record_read_failed", err);
      return reply.status(404).send({ error: "not_found" });
    }
  });

  fastify.post("/records/:recordId/share", async (request, reply) => {
    try {
      const { recordId } = request.params as { recordId: string };
      const user = (request as RequestWithUser).user;
      return reply.send(await manager.createShareLink(recordId, user));
    } catch (err) {
      logger.error("record_share_failed", err);
      return reply.status(404).send({ error: "not_found" });
    }
  });

  fastify.post("/records/:recordId/guidance", async (request, reply) => {
    try {
      const { recordId } = request.params as { recordId: string };
      const body = (request.body ?? {}) as { patientSummary?: string };
      const patientSummary = body.patientSummary ?? "";
      const user = (request as RequestWithUser).user;
      return reply.send(await manager.generateGuidance(recordId, user, patientSummary));
    } catch (err) {
      logger.error("guidance_failed", err);
      return reply.status(404).send({ error: "not_found" });
    }
  });
}
