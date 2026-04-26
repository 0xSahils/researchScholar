"use client";

import { useState, useTransition } from "react";
import { saveSiteSettings } from "@/lib/actions/admin";
import {
  Envelope,
  Phone,
  Globe,
  Lock,
  CreditCard,
  Clock,
  WhatsappLogo,
} from "@phosphor-icons/react";

type Section = {
  title: string;
  icon: React.ElementType;
  fields: Field[];
};

type Field = {
  key: string;
  label: string;
  placeholder?: string;
  type?: string;
  hint?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SiteSettingsManager({ settings }: { settings: any }) {
  const [form, setForm] = useState({
    gst_rate: settings.gst_rate ?? 18,
    whatsapp_number: settings.whatsapp_number ?? "",
    support_email: settings.support_email ?? "",
    working_hours: settings.working_hours ?? "",
    site_title: settings.site_title ?? "",
    site_meta_description: settings.site_meta_description ?? "",
    razorpay_key_id: settings.razorpay_key_id ?? "",
    razorpay_key_secret: settings.razorpay_key_secret ?? "",
    google_analytics_id: settings.google_analytics_id ?? "",
  });

  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        await saveSiteSettings(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (e) {
        setError(String(e));
      }
    });
  };

  const sections: Section[] = [
    {
      title: "Contact & Support",
      icon: Phone,
      fields: [
        { key: "support_email", label: "Support Email", placeholder: "orders@researchscholars.online", type: "email", hint: "Shown on contact page and email footers" },
        { key: "whatsapp_number", label: "WhatsApp Number", placeholder: "+919876543210", hint: "Include country code. Used for WhatsApp links across the site." },
        { key: "working_hours", label: "Working Hours", placeholder: "Mon–Sat 9:00–21:00 IST", hint: "Shown on contact and support pages" },
      ],
    },
    {
      title: "SEO & Metadata",
      icon: Globe,
      fields: [
        { key: "site_title", label: "Site Title", placeholder: "ResearchScholars.online", hint: "Used in <title> tag and Open Graph" },
        { key: "site_meta_description", label: "Meta Description", placeholder: "PhD-led academic support...", hint: "Used in <meta name='description'>" },
        { key: "google_analytics_id", label: "Google Analytics ID", placeholder: "G-XXXXXXXXXX", hint: "Leave blank to disable Analytics" },
      ],
    },
    {
      title: "GST Configuration",
      icon: CreditCard,
      fields: [
        { key: "gst_rate", label: "GST Rate (%)", placeholder: "18", type: "number", hint: "Applied on top of base price. 18 = 18% GST. Change service-specific prices in Pricing & GST." },
      ],
    },
    {
      title: "Payment Gateway (Razorpay)",
      icon: Lock,
      fields: [
        { key: "razorpay_key_id", label: "Razorpay Key ID", placeholder: "rzp_live_...", hint: "Public key shown in frontend" },
        { key: "razorpay_key_secret", label: "Razorpay Key Secret", placeholder: "•••••••••••••••", type: "password", hint: "Stored securely — used only on server side" },
      ],
    },
  ];

  const icons: Record<string, React.ElementType> = {
    "Contact & Support": Phone,
    "SEO & Metadata": Globe,
    "GST Configuration": CreditCard,
    "Payment Gateway (Razorpay)": Lock,
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Site Settings</h1>
        <p className="mt-1 text-sm text-white/40">
          Configure global settings for the platform — contact info, SEO metadata, GST, and payment gateway.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-900/10 px-4 py-3 text-sm text-red-400">
          ❌ {error}
        </div>
      )}

      {sections.map(({ title, fields }) => {
        const Icon = icons[title];
        return (
          <div key={title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
              {Icon && <Icon className="h-4 w-4 text-brand-accent" weight="bold" />}
              <h2 className="text-sm font-semibold text-white/80">{title}</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              {fields.map(({ key, label, placeholder, type, hint }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
                    {label}
                  </label>
                  <input
                    type={type ?? "text"}
                    value={String(form[key as keyof typeof form] ?? "")}
                    onChange={(e) =>
                      set(key, type === "number" ? Number(e.target.value) : e.target.value)
                    }
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-brand-accent/50 focus:outline-none transition"
                  />
                  {hint && <p className="mt-1.5 text-[11px] text-white/25">{hint}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={isPending}
          onClick={handleSave}
          className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition ${
            saved
              ? "bg-green-700/30 text-green-400 border border-green-700/40"
              : "bg-brand-primary text-white hover:bg-brand-deep disabled:opacity-60"
          }`}
        >
          {saved ? "✓ Settings Saved" : isPending ? "Saving…" : "Save All Settings"}
        </button>
        {saved && (
          <p className="text-xs text-white/40">Changes applied to the live site.</p>
        )}
      </div>

      {/* Links */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">Quick Links</p>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/pricing" className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 transition">
            <CreditCard className="h-3.5 w-3.5" />
            Manage Service Prices →
          </a>
          <a href="/" target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 transition">
            <Globe className="h-3.5 w-3.5" />
            View Live Site →
          </a>
        </div>
      </div>

      {/* Env var notice */}
      <div className="rounded-2xl border border-amber-700/30 bg-amber-900/10 p-5">
        <p className="text-sm font-semibold text-amber-400">⚠️ Environment Variables</p>
        <p className="mt-1 text-xs text-amber-200/50 leading-relaxed">
          Some settings like <code className="bg-white/10 px-1 rounded text-amber-300">RESEND_API_KEY</code>, <code className="bg-white/10 px-1 rounded text-amber-300">ADMIN_EMAIL</code>, and <code className="bg-white/10 px-1 rounded text-amber-300">TWILIO_*</code> must be set in your <code className="bg-white/10 px-1 rounded text-amber-300">.env.local</code> file or Vercel environment variables — they cannot be stored in the database for security reasons.
        </p>
      </div>
    </div>
  );
}
