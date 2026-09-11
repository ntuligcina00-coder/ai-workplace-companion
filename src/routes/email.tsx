import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, RefreshCw, Sparkle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  CopyButton,
  EmptyState,
  Field,
  GeneratingState,
  GhostButton,
  Panel,
  PanelHeader,
  PrimaryButton,
  inputClass,
  textareaClass,
} from "@/components/ai-bits";
import { TONES, generateEmail, type EmailDraft, type Tone } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Describe the purpose of your email and generate a subject line and full body in a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Generate, edit and regenerate professional workplace emails in three tones.",
      },
    ],
  }),
  component: EmailGenerator,
});

const EXAMPLES = [
  "Follow up with a client who hasn't replied about the renewal quote",
  "Ask my manager for two days of leave next month",
  "Decline a meeting invitation politely and propose async updates",
];

function EmailGenerator() {
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<EmailDraft | null>(null);

  async function run() {
    if (!context.trim() || loading) return;
    setLoading(true);
    const result = await generateEmail({ context, tone, recipient, sender });
    setDraft(result);
    setLoading(false);
  }

  const fullText = draft ? `Subject: ${draft.subject}\n\n${draft.body}` : "";

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe the situation — get a subject line and a complete, editable email."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
        <Panel>
          <PanelHeader title="Prompt" subtitle="What should this email achieve?" />
          <div className="space-y-5 px-5 py-5">
            <Field label="Purpose / context" hint="Be specific">
              <textarea
                rows={5}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Follow up with a client about the pricing proposal sent two weeks ago and ask for a decision by Friday."
                className={textareaClass}
              />
            </Field>

            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setContext(ex)}
                  className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
                >
                  {ex.length > 44 ? `${ex.slice(0, 42)}…` : ex}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Recipient" hint="Optional">
                <input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Sarah"
                  className={inputClass}
                />
              </Field>
              <Field label="Your name" hint="Optional">
                <input
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Alex Mercer"
                  className={inputClass}
                />
              </Field>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium">Tone</p>
              <div className="grid gap-2 sm:grid-cols-3">
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
            </div>

            <PrimaryButton onClick={run} disabled={!context.trim() || loading} className="w-full">
              {loading ? (
                <>
                  <RefreshCw className="size-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkle className="size-4" /> {draft ? "Generate again" : "Generate email"}
                </>
              )}
            </PrimaryButton>
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="AI draft"
            subtitle="Edit anything below — it's yours"
            actions={
              draft && !loading ? (
                <>
                  <CopyButton value={fullText} label="Copy email" />
                  <GhostButton onClick={run}>
                    <RefreshCw className="size-3.5" /> Regenerate
                  </GhostButton>
                </>
              ) : null
            }
          />

          {loading ? (
            <GeneratingState label="Drafting your email" />
          ) : draft ? (
            <div className="space-y-5 px-5 py-5">
              <Field label="Subject line">
                <input
                  value={draft.subject}
                  onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Email body">
                <textarea
                  rows={20}
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  className={textareaClass}
                />
              </Field>
            </div>
          ) : (
            <EmptyState
              icon={Mail}
              title="No draft yet"
              description="Describe the purpose of your email on the left, pick a tone, and the assistant will write a subject line and full body you can edit."
            />
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
