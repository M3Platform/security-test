export type AppLogger = {
  info: (message: string, meta?: unknown) => void;
  warn: (message: string, meta?: unknown) => void;
  error: (message: string, meta?: unknown) => void;
};

export function createLogger(): AppLogger {
  return {
    info(message, meta) {
      console.log("INFO", message, meta ?? "");
    },
    warn(message, meta) {
      console.warn("WARN", message, meta ?? "");
    },
    error(message, meta) {
      console.error("ERROR", message, meta ?? "");
    },
  };
}
