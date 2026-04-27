"use server";

import { Resend } from "resend";
import twilio from "twilio";

// ─── Clients (lazy-init so they don't crash at build time without env vars) ───

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

function getTwilio() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OrderNotificationData {
  orderNo: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  service: string;
  price: number;
  orderId?: string;
}

// ─── Email Notifications ─────────────────────────────────────────────────────

export async function sendOrderConfirmationEmail(
  order: OrderNotificationData
): Promise<void> {
  // Gracefully skip if no API key (e.g., keys not yet added)
  if (!process.env.RESEND_API_KEY) return;

  try {
    const resend = getResend();
    const from = process.env.RESEND_FROM_EMAIL ?? "updates@researchscholar.online";

    await resend.emails.send({
      from,
      to: order.customerEmail,
      subject: `Order Confirmed — ${order.orderNo} | ResearchScholars`,
      html: orderConfirmationHtml(order),
    });
  } catch (err) {
    // Non-fatal — log but don't crash order flow
    console.error("[sendOrderConfirmationEmail]", err);
  }
}

export interface ManualOrderConfirmationData extends OrderNotificationData {
  advanceAmount: number;
  balanceAmount: number;
}

export async function sendManualOrderConfirmation(
  order: ManualOrderConfirmationData
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const resend = getResend();
    const from = process.env.RESEND_FROM_EMAIL ?? "updates@researchscholar.online";
    await resend.emails.send({
      from,
      to: order.customerEmail,
      subject: `Order Confirmed — ${order.orderNo} | ResearchScholars`,
      html: manualOrderConfirmationHtml(order),
    });
  } catch (err) {
    console.error("[sendManualOrderConfirmation]", err);
  }
}


export async function sendAdminNewOrderAlert(
  order: OrderNotificationData
): Promise<void> {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) return;

  try {
    const resend = getResend();
    const from = process.env.RESEND_FROM_EMAIL ?? "updates@researchscholar.online";
    const adminEmails = process.env.ADMIN_EMAIL.split(",").map((e) => e.trim()).filter(Boolean);

    await resend.emails.send({
      from,
      to: adminEmails,
      subject: `🆕 New Order — ${order.orderNo} (${order.service})`,
      html: adminNewOrderHtml(order),
    });
  } catch (err) {
    console.error("[sendAdminNewOrderAlert]", err);
  }
}

export async function sendDeliveryEmail(
  order: OrderNotificationData & { customerEmail: string },
  fileUrl: string,
  versionLabel?: string
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const resend = getResend();
    const from = process.env.RESEND_FROM_EMAIL ?? "updates@researchscholar.online";

    await resend.emails.send({
      from,
      to: order.customerEmail,
      subject: `✅ Your ${order.service} is ready — ${order.orderNo}${versionLabel ? ` (${versionLabel})` : ""}`,
      html: deliveryEmailHtml(order, fileUrl, versionLabel),
    });
    return { success: true };
  } catch (err) {
    console.error("[sendDeliveryEmail]", err);
    return { success: false, error: String(err) };
  }
}

export async function sendOrderStatusUpdateEmail(
  order: OrderNotificationData,
  newStatus: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const resend = getResend();
    const from = process.env.RESEND_FROM_EMAIL ?? "updates@researchscholar.online";
    
    let displayStatus = newStatus.replace(/_/g, " ").toUpperCase();

    await resend.emails.send({
      from,
      to: order.customerEmail,
      subject: `🔔 Order Status Update: ${displayStatus} — ${order.orderNo}`,
      html: orderStatusUpdateHtml(order, displayStatus),
    });
  } catch (err) {
    console.error("[sendOrderStatusUpdateEmail]", err);
  }
}


// ─── WhatsApp Notifications ───────────────────────────────────────────────────

export async function sendWhatsAppConfirmation(
  phone: string,
  order: OrderNotificationData
): Promise<void> {
  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !phone
  ) return;

  const formattedPhone = formatWhatsAppNumber(phone);
  if (!formattedPhone) return;

  try {
    const client = getTwilio();
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886",
      to: formattedPhone,
      body:
        `✅ *ResearchScholars — Order Confirmed*\n\n` +
        `Hi ${order.customerName}, your order has been received!\n\n` +
        `📋 *Order No:* ${order.orderNo}\n` +
        `📚 *Service:* ${order.service}\n` +
        `💰 *Amount:* ₹${order.price.toLocaleString("en-IN")}\n\n` +
        `Our scholar team will contact you shortly. Track your order at:\n` +
        `https://researchscholars.online/track-order`,
    });
  } catch (err) {
    console.error("[sendWhatsAppConfirmation]", err);
  }
}

export async function sendWhatsAppAdminAlert(
  order: OrderNotificationData
): Promise<void> {
  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.ADMIN_WHATSAPP
  ) return;

  try {
    const client = getTwilio();
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886",
      to: process.env.ADMIN_WHATSAPP,
      body:
        `🆕 *New Order Received!*\n\n` +
        `👤 *Customer:* ${order.customerName}\n` +
        `📧 *Email:* ${order.customerEmail}\n` +
        `📱 *Phone:* ${order.customerPhone ?? "Not provided"}\n` +
        `📋 *Order No:* ${order.orderNo}\n` +
        `📚 *Service:* ${order.service}\n` +
        `💰 *Amount:* ₹${order.price.toLocaleString("en-IN")}\n\n` +
        `Reply here or manage at:\nhttps://researchscholars.online/admin/orders/${order.orderId}`,
    });
  } catch (err) {
    console.error("[sendWhatsAppAdminAlert]", err);
  }
}

export async function sendWhatsAppDelivery(
  phone: string,
  order: OrderNotificationData,
  fileUrl: string
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    return { success: false, error: "Twilio not configured" };
  }

  const formattedPhone = formatWhatsAppNumber(phone);
  if (!formattedPhone) {
    return { success: false, error: "Invalid phone number format" };
  }

  try {
    const client = getTwilio();
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886",
      to: formattedPhone,
      body:
        `✅ *Your ${order.service} is ready!*\n\n` +
        `Hi ${order.customerName},\n\n` +
        `📋 *Order No:* ${order.orderNo}\n\n` +
        `🔗 *Download your file:*\n${fileUrl}\n\n` +
        `Please review and let us know if you need any revisions within your plan scope.\n\n` +
        `— ResearchScholars Team`,
    });
    return { success: true };
  } catch (err) {
    console.error("[sendWhatsAppDelivery]", err);
    return { success: false, error: String(err) };
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatWhatsAppNumber(phone: string): string | null {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");
  // Must be 10 digits (Indian) or already E.164
  if (digits.length === 10) return `whatsapp:+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `whatsapp:+${digits}`;
  if (digits.length === 13 && phone.startsWith("+")) return `whatsapp:${phone}`;
  return null;
}

// ─── Email HTML Templates ─────────────────────────────────────────────────────

function orderConfirmationHtml(order: OrderNotificationData): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: system-ui, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .card { max-width: 560px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
  .header { background: #1B5E20; padding: 32px; text-align: center; }
  .header h1 { color: white; margin: 0; font-size: 22px; }
  .body { padding: 32px; }
  .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px; }
  .label { color: #666; }
  .value { font-weight: 600; color: #1a1a1a; }
  .total { font-size: 20px; color: #1B5E20; }
  .footer { background: #f9f9f9; padding: 20px 32px; font-size: 12px; color: #888; text-align: center; }
  .track-btn { display: inline-block; margin-top: 20px; background: #1B5E20; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; }
</style></head>
<body>
<div class="card">
  <div class="header">
    <p style="color:rgba(255,255,255,0.7);margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase">ResearchScholars</p>
    <h1>Order Confirmed ✓</h1>
  </div>
  <div class="body">
    <p style="color:#555;font-size:15px">Hi ${order.customerName},</p>
    <p style="color:#555;font-size:14px;line-height:1.6">Your request has been received and our scholar allocation desk is reviewing it. You will hear from us within a few hours on working days.</p>
    <div class="row"><span class="label">Order No.</span><span class="value" style="font-family:monospace">${order.orderNo}</span></div>
    <div class="row"><span class="label">Service</span><span class="value">${order.service}</span></div>
    <div class="row"><span class="label">Amount Paid</span><span class="value total">₹${order.price.toLocaleString("en-IN")}</span></div>
    <div style="text-align:center;margin-top:24px">
      <a href="https://researchscholars.online/track-order" class="track-btn">Track Your Order →</a>
    </div>
    <p style="color:#888;font-size:13px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
      For any queries, please write to our contact on WhatsApp.
    </p>
  </div>
  <div class="footer">ResearchScholars.online · PhD-led academic support</div>
</div>
</body></html>`;
}

function manualOrderConfirmationHtml(order: ManualOrderConfirmationData): string {
  const hasAdvance = order.advanceAmount > 0;
  const advanceRow = hasAdvance
    ? `<div class="row"><span class="label">Advance Received</span><span class="value" style="color:#1B5E20">₹${order.advanceAmount.toLocaleString("en-IN")}</span></div>`
    : "";
  const balanceLabel = hasAdvance ? "Balance Due" : "Total Due";
  const balanceColor = order.balanceAmount > 0 ? "#B45309" : "#1B5E20";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: system-ui, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .card { max-width: 560px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
  .header { background: #1B5E20; padding: 32px; text-align: center; }
  .header h1 { color: white; margin: 0; font-size: 22px; }
  .body { padding: 32px; }
  .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px; }
  .label { color: #666; }
  .value { font-weight: 600; color: #1a1a1a; }
  .footer { background: #f9f9f9; padding: 20px 32px; font-size: 12px; color: #888; text-align: center; }
  .track-btn { display: inline-block; margin-top: 20px; background: #1B5E20; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; }
</style></head>
<body>
<div class="card">
  <div class="header">
    <p style="color:rgba(255,255,255,0.7);margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase">ResearchScholars</p>
    <h1>Order Confirmed ✓</h1>
  </div>
  <div class="body">
    <p style="color:#555;font-size:15px">Hi ${order.customerName},</p>
    <p style="color:#555;font-size:14px;line-height:1.6">Your order has been received and confirmed. Our scholar will be in touch shortly.</p>
    <div class="row"><span class="label">Order No.</span><span class="value" style="font-family:monospace">${order.orderNo}</span></div>
    <div class="row"><span class="label">Service</span><span class="value">${order.service}</span></div>
    <div class="row"><span class="label">Quoted Total</span><span class="value">₹${order.price.toLocaleString("en-IN")}</span></div>
    ${advanceRow}
    <div class="row" style="border-bottom:2px solid #1B5E20">
      <span class="label" style="font-weight:700">${balanceLabel}</span>
      <span class="value" style="font-size:18px;color:${balanceColor}">₹${order.balanceAmount.toLocaleString("en-IN")}</span>
    </div>
    <div style="text-align:center;margin-top:24px">
      <a href="https://researchscholars.online/track-order" class="track-btn">Track Your Order →</a>
    </div>
    <p style="color:#888;font-size:13px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
      For any queries, please write to our contact on WhatsApp.
    </p>
  </div>
  <div class="footer">ResearchScholars.online · PhD-led academic support</div>
</div>
</body></html>`;
}

function adminNewOrderHtml(order: OrderNotificationData): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: system-ui, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .card { max-width: 560px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; }
  .header { background: #0D2F17; padding: 24px 32px; }
  .header h1 { color: white; margin: 0; font-size: 18px; }
  .body { padding: 28px 32px; }
  .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; }
  .label { color: #777; } .value { font-weight: 600; }
  .btn { display: inline-block; margin-top: 20px; background: #1B5E20; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; }
</style></head>
<body>
<div class="card">
  <div class="header"><h1>🆕 New Order Received</h1></div>
  <div class="body">
    <div class="row"><span class="label">Order No.</span><span class="value" style="font-family:monospace">${order.orderNo}</span></div>
    <div class="row"><span class="label">Customer</span><span class="value">${order.customerName}</span></div>
    <div class="row"><span class="label">Email</span><span class="value">${order.customerEmail}</span></div>
    <div class="row"><span class="label">Phone</span><span class="value">${order.customerPhone ?? "—"}</span></div>
    <div class="row"><span class="label">Service</span><span class="value">${order.service}</span></div>
    <div class="row"><span class="label">Amount</span><span class="value">₹${order.price.toLocaleString("en-IN")}</span></div>
    <div style="text-align:center;margin-top:24px">
      <a href="https://researchscholars.online/admin/orders/${order.orderId}" class="btn">View Order in Admin →</a>
    </div>
  </div>
</div>
</body></html>`;
}

function deliveryEmailHtml(
  order: OrderNotificationData,
  fileUrl: string,
  versionLabel?: string
): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: system-ui, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .card { max-width: 560px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; }
  .header { background: #1B5E20; padding: 32px; text-align: center; }
  .header h1 { color: white; margin: 0; font-size: 22px; }
  .body { padding: 32px; }
  .btn { display: inline-block; margin-top: 20px; background: #1B5E20; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 15px; }
  .footer { background: #f9f9f9; padding: 16px 32px; font-size: 12px; color: #888; text-align: center; }
</style></head>
<body>
<div class="card">
  <div class="header">
    <p style="color:rgba(255,255,255,0.7);margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase">ResearchScholars</p>
    <h1>Your Work is Ready ✅</h1>
  </div>
  <div class="body">
    <p style="color:#555;font-size:15px">Hi ${order.customerName},</p>
    <p style="color:#555;font-size:14px;line-height:1.7">A document drop for your <strong>${order.service}</strong> (${order.orderNo}) has been dispatched.</p>
    
    ${versionLabel ? `<div style="background:#E8F5E9; border:1px solid #C8E6C9; color:#1B5E20; padding:12px 16px; border-radius:8px; margin:20px 0; font-size:14px; font-weight:600;">Document Stage: ${versionLabel}</div>` : ''}

    <p style="color:#555;font-size:14px;line-height:1.7">Click the button below to access and download your secure file link.</p>
    <div style="text-align:center">
      <a href="${fileUrl}" class="btn">⬇ Download Your File</a>
    </div>
    <p style="color:#888;font-size:13px;margin-top:24px;">If the button doesn't work, copy this link: <br><a href="${fileUrl}" style="word-break:break-all;color:#1B5E20">${fileUrl}</a></p>
    <p style="color:#888;font-size:13px;margin-top:24px;border-top:1px solid #eee;padding-top:16px;">
      Need revisions within your plan scope or have any queries? Please write to our contact on WhatsApp.
    </p>
  </div>
  <div class="footer">ResearchScholars.online · PhD-led academic support</div>
</div>
</body></html>`;
}

function orderStatusUpdateHtml(order: OrderNotificationData, newStatus: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: system-ui, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .card { max-width: 560px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #eee; }
  .header { background: #1B5E20; padding: 32px; text-align: center; }
  .header h1 { color: white; margin: 0; font-size: 22px; }
  .body { padding: 32px; }
  .status-badge { display: inline-block; background: #E8F5E9; color: #1B5E20; font-weight: 800; padding: 8px 16px; border-radius: 6px; font-size: 14px; letter-spacing: 1px; border: 1px solid #C8E6C9; margin: 16px 0; }
  .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px; }
  .label { color: #666; } .value { font-weight: 600; color: #1a1a1a; }
  .btn { display: inline-block; margin-top: 20px; background: #1B5E20; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; text-align: center; }
  .footer { background: #f9f9f9; padding: 16px 32px; font-size: 12px; color: #888; text-align: center; }
</style></head>
<body>
<div class="card">
  <div class="header">
    <p style="color:rgba(255,255,255,0.7);margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase">ResearchScholars</p>
    <h1>Order Update 🔔</h1>
  </div>
  <div class="body">
    <p style="color:#555;font-size:15px;margin-top:0;">Hi ${order.customerName},</p>
    <p style="color:#555;font-size:14px;line-height:1.6">The status of your order has changed. It is currently marked as:</p>
    
    <div style="text-align: center;">
      <span class="status-badge">${newStatus}</span>
    </div>

    <div class="row"><span class="label">Order No.</span><span class="value" style="font-family:monospace">${order.orderNo}</span></div>
    <div class="row"><span class="label">Service</span><span class="value">${order.service}</span></div>
    
    <div style="text-align:center;margin-top:24px">
      <a href="https://researchscholars.online/track-order" class="btn">Track Your Order →</a>
    </div>

    <p style="color:#888;font-size:13px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
      For any queries, please write to our contact on WhatsApp.
    </p>
  </div>
  <div class="footer">ResearchScholars.online · PhD-led academic support</div>
</div>
</body></html>`;
}
