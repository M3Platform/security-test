import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function readGuidanceTemplate(): string {
  const path = resolve(dirname(fileURLToPath(import.meta.url)), "../../prompts/guidance.md");
  return readFileSync(path, "utf8");
}

export function buildGuidancePrompt(template: string, patientSummary: string): string {
  return template.replace("{{PATIENT_SUMMARY}}", patientSummary);
}
