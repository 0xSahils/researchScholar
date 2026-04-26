import { AdminLayout } from "@/components/admin/AdminLayout";
import { BlogCategoriesManager } from "@/components/admin/BlogCategoriesManager";
import { getBlogCategories } from "@/lib/actions/blogs";

export const dynamic = "force-dynamic";

export default async function AdminBlogCategoriesPage() {
  const categories = await getBlogCategories();
  return (
    <AdminLayout>
      <BlogCategoriesManager categories={categories} />
    </AdminLayout>
  );
}
