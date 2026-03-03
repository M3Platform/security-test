import { Storage } from "@google-cloud/storage";
import type { AuditEvent } from "../types.js";

export type AuditLogger = {
  log: (event: AuditEvent) => Promise<void>;
};

function createConsoleAuditLogger(): AuditLogger {
  return {
    async log(event) {
      // Intentionally simple for the exercise.
      console.log("AUDIT", JSON.stringify(event));
    },
  };
}

function createGcsAuditLogger(): AuditLogger {
  const projectId = process.env.GCP_PROJECT_ID;
  const bucketName = process.env.GCS_AUDIT_BUCKET ?? "dev-audit-bucket";
  const storage = new Storage({ projectId });

  return {
    async log(event) {
      const objectName = `audit-${event.action}-${event.targetId}.json`;
      await storage
        .bucket(bucketName)
        .file(objectName)
        .save(JSON.stringify(event), { contentType: "application/json" });
    },
  };
}

export function createAuditLogger(): AuditLogger {
  if (process.env.USE_GCS_AUDIT_LOGGING === "true") {
    return createGcsAuditLogger();
  }

  return createConsoleAuditLogger();
}
