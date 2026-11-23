import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const expectedPassword = process.env.DASHBOARD_PASSWORD || "junto-admin-2026";

    if (!password || password.trim() !== expectedPassword.trim()) {
      return NextResponse.json(
        { error: "Incorrect operations password. Access denied." },
        { status: 401 }
      );
    }

    const token = await createSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully to Junto Operations.",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
