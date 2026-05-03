import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import twilio from "twilio";
import { setOtp } from "@/lib/otp-store";
import { siteConfig } from "@/lib/site-config";

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
        from: process.env.RESEND_FROM_EMAIL ?? "updates@researchscholar.online",
        to: value,
        subject: "Your ResearchScholars Verification Code",
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: system-ui, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .card { max-width: 560px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #eee; }
  .header { background: #1B5E20; padding: 32px; text-align: center; }
  .header h1 { color: white; margin: 0; font-size: 22px; }
  .body { padding: 32px; text-align: center; }
  .code { font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 800; letter-spacing: 4px; background: #f9f9f9; padding: 16px 24px; border-radius: 8px; display: inline-block; color: #1B5E20; border: 1px solid #1B5E2033; margin: 24px 0; }
  .footer { background: #f9f9f9; padding: 16px 32px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; }
</style></head>
<body>
<div class="card">
  <div class="header">
    <p style="color:rgba(255,255,255,0.7);margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase">ResearchScholars</p>
    <h1>Verification Required</h1>
  </div>
  <div class="body">
    <p style="color:#555;font-size:16px;line-height:1.6;margin:0;">Use the following 6-digit code to complete your verification.</p>
    <div class="code">${code}</div>
    <p style="color:#777;font-size:13px;margin:0;">This code will expire in 10 minutes.</p>
    <p style="color:#888;font-size:13px;margin-top:40px;border-top:1px solid #eee;padding-top:16px;">
      Questions? WhatsApp ${siteConfig.phoneDisplay} or email ${siteConfig.email}
    </p>
  </div>
  <div class="footer">ResearchScholars.online · PhD-led academic support</div>
</div>
</body></html>`,
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
