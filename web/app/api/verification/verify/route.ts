import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";

export async function POST(req: NextRequest) {
  const { type, value, code } = await req.json();
  if (!type || !value || !code) return NextResponse.json({ success: false }, { status: 400 });
  const ok = verifyOtp(`${type}:${String(value).toLowerCase()}`, code);
  return NextResponse.json({ success: ok });
}
