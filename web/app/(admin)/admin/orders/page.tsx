import { getOrders } from "@/lib/actions/orders";
import { AllOrders } from "@/components/admin/AllOrders";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; payment?: string; q?: string; page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;
  const { orders, total } = await getOrders({
    status: searchParams.status,
    payment: searchParams.payment,
    q: searchParams.q,
    limit: PAGE_SIZE,
    offset,
  });
  return (
    <AdminLayout>
      <AllOrders orders={orders} total={total} />
    </AdminLayout>
  );
}
