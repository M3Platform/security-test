import type { FastifyReply, FastifyRequest } from "fastify";
import type { AppUser } from "../types.js";

export type RequestWithUser = FastifyRequest & { user: AppUser };

export async function requireUser(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.headers["x-user-id"];
  const role = request.headers["x-role"];

  if (!userId || typeof userId !== "string") {
    return reply.status(401).send({ error: "unauthorized" });
  }

  const parsedRole = role === "admin" ? "admin" : "member";
  (request as RequestWithUser).user = { userId, role: parsedRole };
}
