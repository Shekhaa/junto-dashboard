import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { OpsOverviewResponse } from "@/types/ops";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // 1. Session verification check
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
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

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
      const errorText = await res.text().catch(() => "");
      return NextResponse.json(
        {
          error: res.status === 404
            ? `Django backend returned 404: The endpoint '${endpoint}' does not exist on your deployed Django server. Please push the new 'config/admin_ops_views.py' and 'config/urls.py' to your backend repository.`
            : `Django backend returned status ${res.status}`,
          endpoint,
          details: errorText,
        },
        { status: res.status }
      );
    }
  } catch (err: unknown) {
    const isLocalhost = backendUrl.includes("localhost") || backendUrl.includes("127.0.0.1");
    const errMsg = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      {
        error: `Could not reach Django Backend at ${backendUrl}`,
        endpoint,
        details: errMsg,
        hint: isLocalhost
          ? "You are running on Vercel cloud, which cannot connect to 'localhost' on your personal computer. Set BACKEND_API_URL in your Vercel Project Settings to your public backend URL (e.g. Render, Railway, or Ngrok tunnel like https://abc.ngrok-free.app), or run the dashboard locally with 'npm run dev'."
          : "Ensure your Django server is running and accessible from the public internet.",
      },
      { status: 502 }
    );
  }
}
