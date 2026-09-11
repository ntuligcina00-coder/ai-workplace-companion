import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, RefreshCw, SendHorizontal, User } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CopyButton, GhostButton, Panel, PanelHeader, textareaClass } from "@/components/ai-bits";
import { SUGGESTED_PROMPTS, chatReply } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Chat with an AI assistant about workplace tasks: drafting, summarizing, planning, prioritising and meeting preparation.",
      },
      { property: "og:title", content: "AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Ask workplace questions in plain language and get structured, actionable answers.",
      },
    ],
  }),
  component: Assistant,
});

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/** Minimal renderer: **bold** plus line breaks. */
function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {text.split("\n").map((line, i) =>
        line.trim() === "" ? (
          <div key={i} className="h-1" />
        ) : (
          <p key={i}>
            {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="font-semibold text-foreground">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              ),
            )}
          </p>
        ),
      )}
    </div>
  );
}

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function send(prompt: string) {
    const text = prompt.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: text }]);
    setLoading(true);
    const reply = await chatReply(text);
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    setLoading(false);
  }

  return (
    <AppShell
      title="AI Assistant"
      description="Ask about drafting, planning, prioritising or preparing — in plain language."
    >
      <Panel className="flex h-[calc(100vh-16rem)] min-h-[560px] flex-col overflow-hidden">
        <PanelHeader
          title="Conversation"
          subtitle="Demo assistant — responses are generated locally for this prototype"
          actions={
            messages.length > 0 ? (
              <GhostButton onClick={() => setMessages([])}>Clear chat</GhostButton>
            ) : null
          }
        />

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
          {messages.length === 0 && !loading && (
            <div className="mx-auto max-w-xl py-8 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-xl border border-border bg-surface-elevated">
                <Bot className="size-5 text-accent" />
              </span>
              <h2 className="mt-4 text-base font-semibold tracking-tight">
                How can I help with your work today?
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Start with a suggestion below, or type anything about your workday.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-lg border border-border bg-surface-elevated px-3 py-3 text-left text-xs text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
              {m.role === "assistant" && (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated">
                  <Bot className="size-4 text-accent" />
                </span>
              )}
              <div className={cn("min-w-0 max-w-[80ch]", m.role === "user" && "text-right")}>
                {m.role === "user" ? (
                  <p className="inline-block rounded-xl rounded-tr-sm bg-primary px-4 py-2.5 text-left text-sm text-primary-foreground">
                    {m.content}
                  </p>
                ) : (
                  <>
                    <RichText text={m.content} />
                    <div className="mt-3">
                      <CopyButton value={m.content} label="Copy response" />
                    </div>
                  </>
                )}
              </div>
              {m.role === "user" && (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated">
                  <User className="size-4 text-muted-foreground" />
                </span>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated">
                <Bot className="size-4 animate-pulse text-accent" />
              </span>
              <div className="flex items-center gap-1.5 pt-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
                <span className="ml-2 text-xs text-muted-foreground">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border bg-surface px-5 py-4">
          {messages.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  disabled={loading}
                  className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask anything about your workday…"
              className={textareaClass}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <SendHorizontal className="size-4" />
              )}
            </button>
          </div>
        </div>
      </Panel>
    </AppShell>
  );
}
