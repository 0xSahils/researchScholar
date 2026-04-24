import { getCustomers } from "@/lib/actions/customers";
import { Customers } from "@/components/admin/Customers";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();
  return (
    <AdminLayout>
      <Customers customers={customers} />
    </AdminLayout>
  );
}
