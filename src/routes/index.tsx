import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, FileText, MessageSquare, Clock, Sparkle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader } from "@/components/ai-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A dark, modern AI workspace for drafting emails, summarizing meeting notes and getting instant answers to workplace questions.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meetings and chat with an AI assistant from one clean workspace dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a one-line brief into a polished email with a subject line, in a formal, friendly or persuasive tone.",
  },
  {
    to: "/summarizer",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    body: "Paste raw notes and get an overview, key points, decisions and action items with owners and deadlines.",
  },
  {
    to: "/assistant",
    icon: MessageSquare,
    title: "AI Assistant",
    body: "Ask anything about your work day — planning, prep, drafting, prioritising — in plain language.",
  },
] as const;

const STATS = [
  { label: "Drafts generated", value: "128", delta: "+24 this week" },
  { label: "Meetings summarized", value: "37", delta: "+6 this week" },
  { label: "Action items captured", value: "214", delta: "82% completed" },
  { label: "Hours saved", value: "19.5", delta: "Est. this month" },
] as const;

const ACTIVITY = [
  { title: "Client follow-up email drafted", meta: "Persuasive tone · 12 minutes ago" },
  { title: "Q3 planning notes summarized", meta: "9 action items extracted · 1 hour ago" },
  { title: "Task list created for the week", meta: "AI Assistant · 3 hours ago" },
  { title: "Vendor renewal email regenerated", meta: "Formal tone · Yesterday" },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Your AI workspace at a glance — Friday, a good day to clear the backlog."
    >
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
          <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-1 text-[11px] text-muted-foreground">
              <Sparkle className="size-3 text-accent" />
              AI-powered workspace
            </p>
            <h2 className="mt-5 max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Write, summarize and plan your workday in a fraction of the time.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Three focused tools, one calm interface. Every output is editable, copyable and yours
              to refine.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/email"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Generate an email
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/50"
              >
                Ask the assistant
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</p>
              <p className="mt-1 text-[11px] text-accent">{s.delta}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {TOOLS.map(({ to, icon: Icon, title, body }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40"
            >
              <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface-elevated">
                <Icon className="size-4.5 text-accent" />
              </span>
              <h3 className="mt-4 text-sm font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                Open
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <Panel>
          <PanelHeader title="Recent activity" subtitle="Sample data for this demo workspace" />
          <ul className="divide-y divide-border">
            {ACTIVITY.map((a) => (
              <li key={a.title} className="flex items-center gap-4 px-5 py-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-elevated">
                  <Clock className="size-3.5 text-muted-foreground" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.meta}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
