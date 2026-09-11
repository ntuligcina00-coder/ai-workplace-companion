import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Field, Panel, PanelHeader, inputClass } from "@/components/ai-bits";
import { AI_DISCLAIMER, TONES, type Tone } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Set your name, default email tone, summary detail and AI output preferences for the workspace assistant.",
      },
      { property: "og:title", content: "Workspace Settings" },
      {
        property: "og:description",
        content: "Personalise default tone, summary detail and AI output preferences.",
      },
    ],
  }),
  component: SettingsPage;
});

function Toggle({
  label,
  description,
  defaultOn = false,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-6 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn(!on)}
        className={cn(
          "relative mt-1 h-6 w-11 shrink-0 rounded-full border transition-colors duration-200",
          on ? "border-accent/60 bg-accent/30" : "border-border bg-surface-elevated",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4.5 rounded-full transition-all duration-200",
            on ? "left-[1.4rem] bg-accent" : "left-0.5 bg-muted-foreground",
          )}
        />
      </button>
    </div>
  );
}

function SettingsPage() {
  const [name, setName] = useState("Alex Mercer");
  const [role, setRole] = useState("Operations Lead");
  const [tone, setTone] = useState<Tone>("formal");
  const [detail, setDetail] = useState("balanced");

  return (
    <AppShell title="Settings" description="Preferences that shape how the assistant writes for you.">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Panel>
          <PanelHeader title="Profile" subtitle="Used to sign off generated emails" />
          <div className="space-y-4 px-5 py-5">
            <Field label="Full name">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Job title">
              <input value={role} onChange={(e) => setRole(e.target.value)} className={inputClass} />
            </Field>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Default writing tone" subtitle="Applied to new email drafts" />
          <div className="grid gap-2 px-5 py-5 sm:grid-cols-3">
            {TONES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-left transition-all duration-200",
                  tone === t.value
                    ? "border-accent/60 bg-surface-elevated"
                    : "border-border bg-background hover:border-border/80",
                )}
              >
                <span className="block text-xs font-medium">{t.label}</span>
                <span className="mt-0.5 block text-[10px] leading-tight text-muted-foreground">
                  {t.hint}
                </span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Summary detail" subtitle="How much the summarizer keeps" />
          <div className="grid gap-2 px-5 py-5 sm:grid-cols-3">
            {[
              { id: "concise", label: "Concise", hint: "Headlines only" },
              { id: "balanced", label: "Balanced", hint: "Recommended" },
              { id: "detailed", label: "Detailed", hint: "Keeps nuance" },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setDetail(o.id)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-left transition-all duration-200",
                  detail === o.id
                    ? "border-accent/60 bg-surface-elevated"
                    : "border-border bg-background hover:border-border/80",
                )}
              >
                <span className="block text-xs font-medium">{o.label}</span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground">{o.hint}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="AI output" subtitle="Behaviour of generated content" />
          <div className="divide-y divide-border">
            <Toggle
              label="Always show the AI disclaimer"
              description="Keeps the review reminder visible beneath every generated output."
              defaultOn
            />
            <Toggle
              label="Extract deadlines automatically"
              description="Pulls dates and due-by phrasing from meeting notes into action items."
              defaultOn
            />
            <Toggle
              label="Suggest follow-up prompts"
              description="Shows quick prompt suggestions in the assistant after each reply."
            />
          </div>
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeader title="Responsible AI" subtitle="Please read before relying on any output" />
          <div className="flex items-start gap-3 px-5 py-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated">
              <ShieldAlert className="size-4 text-accent" />
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">{AI_DISCLAIMER}</p>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
