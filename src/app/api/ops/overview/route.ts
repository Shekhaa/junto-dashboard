import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getMockOpsOverview } from "@/lib/mockData";
import { OpsOverviewResponse } from "@/types/ops";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // 1. Session verification check (reads from request.cookies or cookies())
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value || cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Please authenticate at /login." },
      { status: 401 }
    );
  }

  // 2. Fetch live data from Django Backend
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
  const backendOpsKey = process.env.BACKEND_OPS_KEY || "junto-ops-secret-key-2026";
  const endpoint = `${backendUrl.replace(/\/+$/, "")}/api/admin-ops/overview/`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

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
      const data: OpsOverviewResponse = await res.json();
      return NextResponse.json(data);
    } else {
      console.warn(`[Junto Ops] Backend returned status ${res.status}. Falling back to baseline telemetry.`);
      return NextResponse.json(getMockOpsOverview());
    }
  } catch (err) {
    console.warn("[Junto Ops] Backend unreachable or timed out. Serving fallback telemetry buffer.", err);
    return NextResponse.json(getMockOpsOverview());
  }
}
