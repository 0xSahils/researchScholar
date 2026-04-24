import { getOrderById } from "@/lib/actions/orders";
import { OrderDetail } from "@/components/admin/OrderDetail";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  let order;
  try {
    order = await getOrderById(params.id);
  } catch {
    notFound();
  }
  return (
    <AdminLayout>
      <OrderDetail order={order} />
    </AdminLayout>
  );
}
