import { getDashboardStats } from "@/lib/actions/orders";
import { DashboardHome } from "@/components/admin/DashboardHome";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const stats = await getDashboardStats();

  return (
    <AdminLayout>
      <DashboardHome stats={stats} revenueLast30Days={stats.revenueLast30Days} deadlineAlerts={stats.deadlineAlerts} />
    </AdminLayout>
  );
}
