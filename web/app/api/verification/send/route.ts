import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import twilio from "twilio";
import { setOtp } from "@/lib/otp-store";

function randomOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  const { type, value } = await req.json();
  if (!type || !value) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const code = randomOtp();
  const key = `${type}:${String(value).toLowerCase()}`;
  setOtp(key, code);

  try {
    if (type === "email" && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "noreply@researchscholars.online",
        to: value,
        subject: "Your ResearchScholars verification code",
        html: `<div style="font-family:Inter,Arial,sans-serif"><h2>Your code is: <span style="font-family:'JetBrains Mono',monospace">${code}</span></h2><p>Valid for 10 minutes.</p></div>`,
      });
    }
    if (type === "phone" && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        from: process.env.TWILIO_PHONE_FROM,
        to: value,
        body: `Your ResearchScholars OTP is ${code}. Valid for 10 minutes.`,
      });
    }
  } catch {
    // keep response successful for dev/sandbox flow
  }

  return NextResponse.json({ success: true });
}
