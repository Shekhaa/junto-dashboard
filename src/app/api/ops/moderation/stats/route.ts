import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { ModerationStats } from "@/types/ops";

export const dynamic = "force-dynamic";

const zeroStats: ModerationStats = {
  pending_reports: 0,
  auto_hidden_posts: 0,
  doxxing_attempts_blocked: 0,
  banned_users: 0,
};

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value || cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please authenticate." }, { status: 401 });
  }

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
  const backendOpsKey = process.env.BACKEND_OPS_KEY || "junto-ops-secret-key-2026";
  const endpoint = `${backendUrl.replace(/\/+$/, "")}/api/moderation/stats/`;

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
      const data: ModerationStats = await res.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(zeroStats);
    }
  } catch {
    return NextResponse.json(zeroStats);
  }
}
