import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Mail,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  X,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_DISCLAIMER } from "@/lib/mock-ai";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/summarizer", label: "Meeting Summarizer", icon: FileText },
  { to: "/assistant", label: "AI Assistant", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0 transition-colors",
                active ? "text-accent" : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col bg-sidebar px-4 py-5">
      <Link to="/" onClick={onNavigate} className="mb-8 flex items-center gap-3 px-1">
        <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface-elevated">
          <Bot className="size-4.5 text-accent" />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold tracking-tight text-foreground">
            Workplace AI
          </span>
          <span className="block text-[11px] text-muted-foreground">Productivity Assistant</span>
        </span>
      </Link>

      <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
        Workspace
      </p>
      <NavLinks onNavigate={onNavigate} />

      <div className="mt-auto rounded-lg border border-border bg-surface p-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">{AI_DISCLAIMER}</p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border lg:block">
        <SidebarInner />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-10">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">{title}</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>

        <footer className="px-4 pb-10 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-6xl rounded-lg border border-border bg-surface px-4 py-3">
            <p className="text-xs leading-relaxed text-muted-foreground">{AI_DISCLAIMER}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
