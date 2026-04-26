"use client";

import { useState, useTransition } from "react";
import { saveSiteSettings } from "@/lib/actions/admin";
import { Globe, CreditCard, ChartLine } from "@phosphor-icons/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SiteSettingsManager({ settings }: { settings: any }) {
  const [form, setForm] = useState({
    gst_rate: settings.gst_rate ?? 18,
    site_title: settings.site_title ?? "",
    site_meta_description: settings.site_meta_description ?? "",
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

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Site Settings</h1>
        <p className="mt-1 text-sm text-white/40">
          Configure GST rate, SEO metadata, and platform-level settings.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-900/10 px-4 py-3 text-sm text-red-400">
          ❌ {error}
        </div>
      )}

      {/* GST Configuration */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
          <CreditCard className="h-4 w-4 text-brand-accent" weight="bold" />
          <h2 className="text-sm font-semibold text-white/80">GST Configuration</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
              GST Rate (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={String(form.gst_rate)}
              onChange={(e) => set("gst_rate", Number(e.target.value))}
              placeholder="18"
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-brand-accent/50 focus:outline-none transition"
            />
            <p className="mt-1.5 text-[11px] text-white/25">
              Applied on top of every base price across the entire platform. 18 = 18% GST. Set to 0 to disable GST display.
            </p>
          </div>
        </div>
      </div>

      {/* SEO & Metadata */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
          <Globe className="h-4 w-4 text-brand-accent" weight="bold" />
          <h2 className="text-sm font-semibold text-white/80">SEO &amp; Metadata</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          {[
            { key: "site_title", label: "Site Title", placeholder: "ResearchScholars.online", hint: "Used in <title> tag and Open Graph" },
            { key: "site_meta_description", label: "Meta Description", placeholder: "PhD-led academic support...", hint: "Used in <meta name='description'>" },
          ].map(({ key, label, placeholder, hint }) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">{label}</label>
              <input
                type="text"
                value={String(form[key as keyof typeof form] ?? "")}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-brand-accent/50 focus:outline-none transition"
              />
              {hint && <p className="mt-1.5 text-[11px] text-white/25">{hint}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Google Analytics — Phase 2 */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden opacity-60">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
          <ChartLine className="h-4 w-4 text-brand-accent" weight="bold" />
          <h2 className="text-sm font-semibold text-white/80">Google Analytics</h2>
          <span className="ml-auto rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
            Phase 2
          </span>
        </div>
        <div className="px-6 py-5">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">Google Analytics ID</label>
          <input
            type="text"
            value={form.google_analytics_id}
            onChange={(e) => set("google_analytics_id", e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-brand-accent/50 focus:outline-none transition"
          />
          <p className="mt-1.5 text-[11px] text-white/25">
            Save your GA ID here — tracking script will be wired in Phase 2.
          </p>
        </div>
      </div>

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

      {/* Quick Links */}
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
          Keys like <code className="bg-white/10 px-1 rounded text-amber-300">RESEND_API_KEY</code>, <code className="bg-white/10 px-1 rounded text-amber-300">ADMIN_EMAIL</code>, <code className="bg-white/10 px-1 rounded text-amber-300">RAZORPAY_KEY_ID</code>, and <code className="bg-white/10 px-1 rounded text-amber-300">TWILIO_*</code> must be set in your <code className="bg-white/10 px-1 rounded text-amber-300">.env.local</code> file or Vercel environment variables — they cannot be stored in the database for security reasons.
        </p>
      </div>
    </div>
  );
}
