import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { ReportedPost } from "@/types/ops";

export const dynamic = "force-dynamic";

const fallbackReports: ReportedPost[] = [
  {
    id: 901,
    content: "CS Dept HOD Dr. Sharma leaks midterm paper for Section B students. DM me for PDF download.",
    is_anonymous: true,
    author_id: 44,
    author_roll: "21BCSE088",
    author_name: "Rohan Gupta",
    author_email: "student_rohan@gehu.ac.in",
    reports_count: 8,
    reasons: ["Faculty Defamation", "Academic Misconduct / Fake Info"],
    is_hidden: true,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 902,
    content: "Selling hostel gate pass stamps for 2nd year girls hostel tonight. Call 9876543210 immediately.",
    is_anonymous: true,
    author_id: 89,
    author_roll: "22BCSE114",
    author_name: "Aman Negi",
    author_email: "aman.negi@geu.ac.in",
    reports_count: 5,
    reasons: ["Doxxing Phone Number", "Campus Safety Violation"],
    is_hidden: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 903,
    content: "Boycott the cafeteria vendor at Block 3, found expired milk packets in canteen store room.",
    is_anonymous: false,
    author_id: 102,
    author_roll: "20BCSE012",
    author_name: "Siddharth Rao",
    author_email: "sid.rao@dit.edu.in",
    reports_count: 3,
    reasons: ["Dispute / Unverified Accusation"],
    is_hidden: false,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 904,
    content: "Priya Sharma from Section A is cheating on assignments with our TA. Here is her Instagram handle.",
    is_anonymous: true,
    author_id: 67,
    author_roll: "23BCSE302",
    author_name: "Karan Mehra",
    author_email: "karan.mehra@gehu.ac.in",
    reports_count: 12,
    reasons: ["Harassment / Bullying", "Doxxing / Privacy Violation"],
    is_hidden: true,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

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
    const timeoutId = setTimeout(() => controller.abort(), 6000);

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
      console.warn(`[Junto Moderation] Backend returned status ${res.status}. Falling back to default reports.`);
      return NextResponse.json(fallbackReports);
    }
  } catch (err) {
    console.warn("[Junto Moderation] Backend unreachable. Serving fallback reports buffer.", err);
    return NextResponse.json(fallbackReports);
  }
}
