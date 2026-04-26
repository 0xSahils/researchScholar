import { AdminLayout } from "@/components/admin/AdminLayout";
import { BlogAdminTable } from "@/components/admin/BlogAdminTable";
import { getAdminBlogs } from "@/lib/actions/blogs";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const blogs = await getAdminBlogs();
  return (
    <AdminLayout>
      <BlogAdminTable blogs={blogs} />
    </AdminLayout>
  );
}
