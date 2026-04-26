import { AdminLayout } from "@/components/admin/AdminLayout";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { getSiteSettings } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings = {};
  try {
    settings = await getSiteSettings();
  } catch {
    // DB not seeded yet — use empty defaults
  }
  return (
    <AdminLayout>
      <SiteSettingsManager settings={settings} />
    </AdminLayout>
  );
}
