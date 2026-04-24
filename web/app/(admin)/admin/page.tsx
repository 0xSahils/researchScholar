import { getDashboardStats, getMonthlyEarnings } from "@/lib/actions/orders";
import { DashboardHome } from "@/components/admin/DashboardHome";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [stats, chartData] = await Promise.all([
    getDashboardStats(),
    getMonthlyEarnings(),
  ]);

  return (
    <AdminLayout>
      <DashboardHome stats={stats} recentOrders={stats.recentOrders} chartData={chartData} />
    </AdminLayout>
  );
}
