import { NextResponse } from "next/server";

/** Log internal detail; return a generic Spanish message to the client. */
export function adminError(
  clientMessage: string,
  status: number,
  logDetail?: unknown,
): NextResponse {
  if (logDetail !== undefined) {
    console.error("[admin]", logDetail);
  }
  return NextResponse.json({ error: clientMessage }, { status });
}

export function parsePagination(searchParams: URLSearchParams): {
  limit: number;
  offset: number;
} {
  const rawLimit = Number.parseInt(searchParams.get("limit") ?? "50", 10);
  const rawOffset = Number.parseInt(searchParams.get("offset") ?? "0", 10);
  const limit = Math.min(Math.max(Number.isFinite(rawLimit) ? rawLimit : 50, 1), 200);
  const offset = Math.max(Number.isFinite(rawOffset) ? rawOffset : 0, 0);
  return { limit, offset };
}
