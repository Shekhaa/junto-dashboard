import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { ReportedPost } from "@/types/ops";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value || cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please authenticate." }, { status: 401 });
  }

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
  const backendOpsKey = process.env.BACKEND_OPS_KEY || "junto-ops-secret-key-2026";
  const endpoint = `${backendUrl.replace(/\/+$/, "")}/api/moderation/reports/`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "X-Admin-Secret-Key": backendOpsKey,
        "Accept": "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data: ReportedPost[] = await res.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: `Django moderation reports returned status ${res.status}`, endpoint },
        { status: res.status }
      );
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Cannot reach Django backend at ${backendUrl}`, details: errMsg },
      { status: 502 }
    );
  }
}
