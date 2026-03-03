export type AppUser = {
  userId: string;
  role: "member" | "admin";
};

export type HealthRecord = {
  id: string;
  ownerUserId: string;
  patientName: string;
  dob: string;
  encounterSummary: string;
  notes: string;
};

export type AuditEvent = {
  actor: string;
  action: string;
  targetId: string;
  result: "success" | "failure";
  details?: unknown;
};
