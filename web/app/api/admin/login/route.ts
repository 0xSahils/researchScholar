import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "rs_admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function signToken(payload: string, secret: string): string {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  return `${payload}.${hmac.digest("hex")}`;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const validUser = process.env.ADMIN_USERNAME ?? "admin";
    const validPass = process.env.ADMIN_PASSWORD ?? "admin";

    const userMatch = username === validUser;
    const passMatch = password === validPass;

    if (!userMatch || !passMatch) {
      // Uniform error — don't reveal which field was wrong
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const secret = process.env.ADMIN_SESSION_SECRET ?? "fallback_secret";
    const payload = `admin:${Date.now()}`;
    const token = signToken(payload, secret);

    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,       // not accessible from JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("[admin/login]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
