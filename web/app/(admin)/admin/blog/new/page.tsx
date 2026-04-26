import { AdminLayout } from "@/components/admin/AdminLayout";
import { BlogEditorForm } from "@/components/admin/BlogEditorForm";
import { getBlogCategories } from "@/lib/actions/blogs";

export default async function AdminBlogNewPage() {
  const categories = await getBlogCategories();
  return (
    <AdminLayout>
      <BlogEditorForm categories={categories} />
    </AdminLayout>
  );
}
