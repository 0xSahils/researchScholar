"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Article,
  ChartBar,
  CurrencyDollar,
  Gear,
  ListBullets,
  Package,
  Plus,
  Tag,
  X,
  List,
  GraduationCap,
  ArrowSquareOut,
  SignOut,
} from "@phosphor-icons/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: ChartBar },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/orders/new", label: "Add Order", icon: Plus },
  { href: "/admin/pricing", label: "Pricing & GST", icon: CurrencyDollar },
  { href: "/admin/blog", label: "Blog Posts", icon: Article },
  { href: "/admin/blog/categories", label: "Blog Categories", icon: Tag },
  { href: "/admin/settings", label: "Site Settings", icon: Gear },
  { href: "/admin/payments", label: "Payments", icon: ListBullets },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, startLogout] = useTransition();

  const handleLogout = () => {
    startLogout(async () => {
      await fetch("/api/admin/login", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    });
  };

  const pageTitle = navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? "Admin";

  return (
    <div className="min-h-[100dvh] bg-[#0a0f0b] text-white flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/[0.06] bg-[#0d1410] fixed top-0 left-0 h-full z-40">
        <SidebarContent pathname={pathname} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </aside>

      {/* Sidebar — Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 z-50 bg-[#0d1410] border-r border-white/[0.06] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent
          pathname={pathname}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-white/[0.06] bg-[#0a0f0b]/90 backdrop-blur flex items-center px-4 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition text-white/60"
          >
            <List className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/35">{pageTitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-700/30 ring-1 ring-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                A
              </div>
              <span className="hidden sm:block text-xs text-white/50 font-mono">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-red-400 hover:bg-red-400/10 transition border border-transparent hover:border-red-400/20"
            >
              <SignOut className="h-4 w-4" />
              {isLoggingOut ? "..." : "Logout"}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  onClose,
  onLogout,
  isLoggingOut,
}: {
  pathname: string;
  onClose?: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  return (
    <>
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-white/[0.06] gap-3">
        <div className="h-8 w-8 rounded-lg bg-emerald-800 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="h-5 w-5 text-white" weight="bold" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-none">ResearchScholars</p>
          <p className="text-[10px] text-white/30 mt-0.5 font-mono uppercase tracking-widest">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto p-1.5 rounded-lg hover:bg-white/5 transition text-white/40">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-[10px] uppercase tracking-widest text-white/25 font-mono mb-3">Navigation</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-700/20 text-emerald-400 ring-1 ring-emerald-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-emerald-400" : "text-white/30 group-hover:text-white/70"}`} weight={isActive ? "bold" : "regular"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
        <Link href="/" target="_blank"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-white/30 hover:text-white/60 hover:bg-white/5 transition">
          <ArrowSquareOut className="h-4 w-4" />
          View live site
        </Link>
        <button onClick={onLogout} disabled={isLoggingOut}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-white/30 hover:text-red-400 hover:bg-red-400/10 transition">
          <SignOut className="h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );
}
