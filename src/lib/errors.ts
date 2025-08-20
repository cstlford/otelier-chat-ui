export type ErrorSeverity = "info" | "warning" | "error" | "critical";

export type ErrorSource = "api" | "sse" | "ui" | "unknown";

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  severity: ErrorSeverity;
  source: ErrorSource;
  details?: unknown;
}

export function normalizeError(err: unknown, defaults?: Partial<AppError>): AppError {
  // Fetch Abort
  if (err && typeof err === "object" && (err as any).name === "AbortError") {
    return {
      message: "Request was aborted",
      severity: "warning",
      source: defaults?.source ?? "api",
      ...defaults,
    };
  }

  // HTTP-like error thrown manually
  if (err && typeof err === "object" && "status" in (err as any)) {
    const e = err as any;
    return {
      message: e.message || "Request failed",
      status: typeof e.status === "number" ? e.status : undefined,
      code: e.code,
      severity: defaults?.severity ?? "error",
      source: defaults?.source ?? "api",
      details: e.details,
      ...defaults,
    };
  }

  // Generic Error
  if (err instanceof Error) {
    return {
      message: err.message || "An unexpected error occurred",
      severity: defaults?.severity ?? "error",
      source: defaults?.source ?? "unknown",
      ...defaults,
    };
  }

  // Unknown
  return {
    message: typeof err === "string" ? err : "An unexpected error occurred",
    severity: defaults?.severity ?? "error",
    source: defaults?.source ?? "unknown",
    ...defaults,
  };
}
