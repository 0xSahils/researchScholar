import { AdminLayout } from "@/components/admin/AdminLayout";
import { PricingManager } from "@/components/admin/PricingManager";
import { getPricingRows } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const rows = await getPricingRows();
  return (
    <AdminLayout>
      <PricingManager rows={rows} />
    </AdminLayout>
  );
}
