import { AdminLayout } from "@/components/admin/AdminLayout";
import { ManualOrderForm } from "@/components/admin/ManualOrderForm";

export default function AdminNewOrderPage() {
  return (
    <AdminLayout>
      <div className="space-y-5">
        <h1 className="text-2xl font-heading font-bold text-white">Add Manual Order</h1>
        <ManualOrderForm />
      </div>
    </AdminLayout>
  );
}
