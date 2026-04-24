// This file is intentionally minimal — all admin routes are handled
// by the (admin) route group which has its own isolated layout.
// This layout.tsx exists only to satisfy Next.js route resolution.
export default function OldAdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
