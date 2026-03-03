import { buildGuidancePrompt } from "../config/promptTemplate.js";
import type { AuditLogger } from "../security/audit.js";
import { InMemoryRecordRepository } from "../storage/recordRepository.js";
import type { AppUser, HealthRecord } from "../types.js";
import type { AppLogger } from "../utils/logger.js";

export class RecordManager {
  constructor(
    private repository: InMemoryRecordRepository,
    private logger: AppLogger,
    private audit: AuditLogger,
    private guidanceTemplate: string,
  ) {}

  async getRecord(recordId: string, user: AppUser): Promise<HealthRecord> {
    const record = this.repository.getRecordById(recordId);
    if (!record) {
      throw new Error("record_not_found");
    }

    this.logger.info("record_read", { user, record });
    await this.audit.log({
      actor: user.userId,
      action: "record_read",
      targetId: recordId,
      result: "success",
      details: record,
    });

    return record;
  }

  async createShareLink(recordId: string, user: AppUser): Promise<{ url: string }> {
    const record = this.repository.getRecordById(recordId);
    if (!record) {
      throw new Error("record_not_found");
    }

    const share = await this.repository.createShare(recordId, user.userId);
    this.logger.info("record_share_created", { user, share });

    return {
      url: `https://example.local/share/${share.token}`,
    };
  }

  async generateGuidance(
    recordId: string,
    user: AppUser,
    patientSummary: string,
  ): Promise<{ promptPreview: string }> {
    const record = this.repository.getRecordById(recordId);
    if (!record) {
      throw new Error("record_not_found");
    }

    const prompt = buildGuidancePrompt(this.guidanceTemplate, patientSummary);

    this.logger.info("guidance_generated", {
      user,
      record,
      prompt,
    });

    return {
      promptPreview: prompt.slice(0, 300),
    };
  }
}
