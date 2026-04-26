import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BlogEditorForm } from "@/components/admin/BlogEditorForm";
import { getBlogById, getBlogCategories } from "@/lib/actions/blogs";

export default async function AdminBlogEditPage({ params }: { params: { id: string } }) {
  let post;
  try {
    post = await getBlogById(params.id);
  } catch {
    notFound();
  }
  const categories = await getBlogCategories();
  return (
    <AdminLayout>
      <BlogEditorForm categories={categories} initial={post} />
    </AdminLayout>
  );
}
