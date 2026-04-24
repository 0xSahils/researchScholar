// This layout exists only so Next.js admin segment gets a layout entry point.
// The actual admin UI (AdminLayout component) is rendered by each page.
// html/body is provided by the ROOT app/layout.tsx — NOT here.
export default function AdminSegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
