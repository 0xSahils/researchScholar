import { getPayments } from "@/lib/actions/payments";
import { Payments } from "@/components/admin/Payments";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const payments = await getPayments();
  return (
    <AdminLayout>
      <Payments payments={payments} />
    </AdminLayout>
  );
}
