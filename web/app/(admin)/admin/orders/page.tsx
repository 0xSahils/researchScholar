import { getOrders } from "@/lib/actions/orders";
import { AllOrders } from "@/components/admin/AllOrders";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const orders = await getOrders({ status: searchParams.status, q: searchParams.q });
  return (
    <AdminLayout>
      <AllOrders orders={orders} total={orders.length} />
    </AdminLayout>
  );
}
