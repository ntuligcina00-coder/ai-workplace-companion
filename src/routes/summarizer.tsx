import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, RefreshCw, Sparkle } from "lucide-react";
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
import { summarizeNotes, summaryToText, type MeetingSummary } from "@/lib/mock-ai";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste lengthy meeting notes and get a structured summary with key points, decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into a clean, editable summary with owners and deadlines.",
      },
    ],
  }),
  component: Summarizer;
});

const SAMPLE = `Weekly product sync — attendees: Priya, Daniel, Sam, Thandi
Priya opened with the current sprint status; two of five stories are complete and the reporting story is blocked on data access.
Daniel raised that the onboarding redesign is testing well with users but the copy still needs a legal review.
Sam noted the support queue has grown 18% since the last release, mostly around billing confusion.
The team agreed to prioritise the billing clarity fix ahead of the roadmap item for analytics.
We decided to push the analytics beta to next month rather than rush it.
Action: Daniel will send the onboarding copy to legal for review.
Action: Sam will prepare a breakdown of the top five support themes.
Action: Priya will unblock data access with the platform team and share the revised sprint plan.
Thandi will schedule a follow-up review for the end of next week.`;

function Summarizer() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<MeetingSummary | null>(null);

  async function run() {
    if (!notes.trim() || loading) return;
    setLoading(true);
    setSummary(await summarizeNotes(notes));
    setLoading(false);
  }

  function updateAction(i: number, patch: Partial<MeetingSummary["actionItems"][number]>) {
    if (!summary) return;
    const actionItems = summary.actionItems.map((a, idx) => (idx === i ? { ...a, ...patch } : a));
    setSummary({ ...summary, actionItems });
  }

  function updateList(key: "keyPoints" | "decisions", i: number, value: string) {
    if (!summary) return;
    setSummary({ ...summary, [key]: summary[key].map((v, idx) => (idx === i ? value : v)) });
  }

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Paste raw notes — get an overview, decisions and action items with owners and deadlines."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
        <Panel>
          <PanelHeader
            title="Meeting notes"
            subtitle={wordCount ? `${wordCount} words pasted` : "Paste your raw notes or transcript"}
            actions={
              <GhostButton onClick={() => setNotes(SAMPLE)}>Load sample notes</GhostButton>
            }
          />
          <div className="space-y-4 px-5 py-5">
            <textarea
              rows={18}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your meeting notes, transcript or scribbles here — the messier the better."
              className={textareaClass}
            />
            <div className="flex gap-2">
              <PrimaryButton onClick={run} disabled={!notes.trim() || loading} className="flex-1">
                {loading ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" /> Summarizing…
                  </>
                ) : (
                  <>
                    <Sparkle className="size-4" /> {summary ? "Summarize again" : "Summarize notes"}
                  </>
                )}
              </PrimaryButton>
              {notes && (
                <GhostButton
                  onClick={() => {
                    setNotes("");
                    setSummary(null);
                  }}
                >
                  Clear
                </GhostButton>
              )}
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Structured summary"
            subtitle="Every field is editable"
            actions={
              summary && !loading ? (
                <>
                  <CopyButton value={summaryToText(summary)} label="Copy summary" />
                  <GhostButton onClick={run}>
                    <RefreshCw className="size-3.5" /> Regenerate
                  </GhostButton>
                </>
              ) : null
            }
          />

          {loading ? (
            <GeneratingState label="Reading and structuring your notes" />
          ) : summary ? (
            <div className="space-y-6 px-5 py-5">
              <Field label="Overview">
                <textarea
                  rows={3}
                  value={summary.overview}
                  onChange={(e) => setSummary({ ...summary, overview: e.target.value })}
                  className={textareaClass}
                />
              </Field>

              <div>
                <p className="mb-2 text-xs font-medium">Key discussion points</p>
                <div className="space-y-2">
                  {summary.keyPoints.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-accent" />
                      <input
                        value={p}
                        onChange={(e) => updateList("keyPoints", i, e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium">Decisions made</p>
                <div className="space-y-2">
                  {summary.decisions.map((d, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                      <input
                        value={d}
                        onChange={(e) => updateList("decisions", i, e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium">Action items, owners and deadlines</p>
                <div className="space-y-3">
                  {summary.actionItems.map((a, i) => (
                    <div key={i} className="rounded-lg border border-border bg-background p-3">
                      <input
                        value={a.task}
                        onChange={(e) => updateAction(i, { task: e.target.value })}
                        className={inputClass}
                      />
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <input
                          value={a.owner}
                          onChange={(e) => updateAction(i, { owner: e.target.value })}
                          placeholder="Owner"
                          className={inputClass}
                        />
                        <input
                          value={a.deadline}
                          onChange={(e) => updateAction(i, { deadline: e.target.value })}
                          placeholder="Deadline"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="Nothing summarized yet"
              description="Paste notes on the left, or load the sample, and the assistant will pull out the key points, decisions, action items, owners and deadlines."
            />
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
