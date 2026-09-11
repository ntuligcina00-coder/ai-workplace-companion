/**
 * Frontend-only mock "AI" engine.
 * Produces realistic, context-aware sample content with simulated latency.
 * No backend, no external APIs.
 */

export const AI_DISCLAIMER =
  "AI-generated content may contain errors. Always review and verify AI outputs before using them for important workplace decisions or communications.";

export type Tone = "formal" | "friendly" | "persuasive";

export const TONES: { value: Tone; label: string; hint: string }[] = [
  { value: "formal", label: "Formal", hint: "Polished and professional" },
  { value: "friendly", label: "Friendly", hint: "Warm and conversational" },
  { value: "persuasive", label: "Persuasive", hint: "Confident and convincing" },
];

export function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function pick<T>(items: T[], seed: number): T {
  return items[Math.abs(seed) % items.length] as T;
}

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return h;
}

function topic(context: string) {
  const cleaned = context.trim().replace(/\s+/g, " ");
  if (!cleaned) return "our recent discussion";
  const first = cleaned.split(/[.!?\n]/)[0] ?? cleaned;
  return first.length > 70 ? `${first.slice(0, 67)}...` : first;
}

export interface EmailDraft {
  subject: string;
  body: string;
}

export async function generateEmail(input: {
  context: string;
  tone: Tone;
  recipient?: string;
  sender?: string;
}): Promise<EmailDraft> {
  await delay(900 + Math.random() * 700);
  const seed = hash(input.context + input.tone + Math.random().toString());
  const subj = topic(input.context);
  const to = input.recipient?.trim() || "there";
  const from = input.sender?.trim() || "Alex Mercer";

  const subjects: Record<Tone, string[]> = {
    formal: [
      `Regarding ${subj}`,
      `Follow-up: ${subj}`,
      `Update and next steps — ${subj}`,
    ],
    friendly: [`Quick note about ${subj}`, `Checking in on ${subj}`, `A few thoughts on ${subj}`],
    persuasive: [
      `Why ${subj} deserves your attention`,
      `An opportunity: ${subj}`,
      `Let's move forward on ${subj}`,
    ],
  };

  const openings: Record<Tone, string[]> = {
    formal: [
      `Dear ${to},\n\nI hope this message finds you well. I am writing in connection with ${subj.toLowerCase()}.`,
      `Dear ${to},\n\nThank you for your time. I would like to share an update regarding ${subj.toLowerCase()}.`,
    ],
    friendly: [
      `Hi ${to},\n\nHope your week is going well! I wanted to reach out about ${subj.toLowerCase()}.`,
      `Hi ${to},\n\nQuick one from me — I've been thinking about ${subj.toLowerCase()}.`,
    ],
    persuasive: [
      `Hi ${to},\n\nI'll keep this brief because I think ${subj.toLowerCase()} is worth your time.`,
      `Hi ${to},\n\nThere's a clear opportunity in front of us with ${subj.toLowerCase()}, and I'd like your support to act on it.`,
    ],
  };

  const middles: Record<Tone, string[]> = {
    formal: [
      `To summarise the position: the work is progressing according to plan, the key dependencies have been identified, and the remaining risks are being tracked. I have outlined below the points that require your attention.\n\n• Current status and completed milestones\n• Outstanding decisions and their owners\n• Proposed timeline for the next phase\n\nShould you require any additional detail, I would be glad to provide it.`,
      `For clarity, I have set out the essential details below.\n\n• Background and rationale\n• The recommended course of action\n• Resources and timelines required\n\nI would welcome your review and any guidance you consider appropriate.`,
    ],
    friendly: [
      `Here's where things stand: most of the groundwork is done, and we're in good shape for the next step. A couple of things would really help to lock in:\n\n• A quick confirmation on the timeline\n• Your thoughts on the approach outlined\n• Anything you'd like changed before we go ahead\n\nHappy to jump on a short call if that's easier than email ping-pong.`,
      `Nothing urgent, but I'd love your input on a couple of points:\n\n• Whether the current direction still makes sense to you\n• If there's anyone else who should be in the loop\n• A rough date that works for the next check-in`,
    ],
    persuasive: [
      `Three reasons this makes sense right now:\n\n1. The effort required is modest, and the groundwork is already in place.\n2. Acting this quarter avoids a far more expensive fix later.\n3. The team has the capacity and the appetite to deliver it well.\n\nI'm confident we can show measurable results within the first few weeks.`,
      `Consider the trade-off: a small commitment now unlocks a disproportionate return later. We have the data, the plan, and the people — what's missing is the green light.\n\n• Low downside, clearly scoped\n• Fast, visible early wins\n• Fully reversible if results disappoint`,
    ],
  };

  const closings: Record<Tone, string[]> = {
    formal: [
      `I look forward to your response at your earliest convenience.\n\nKind regards,\n${from}`,
      `Thank you for your consideration.\n\nYours sincerely,\n${from}`,
    ],
    friendly: [`Thanks so much — let me know what you think!\n\nBest,\n${from}`, `Talk soon,\n${from}`],
    persuasive: [
      `Can I have your go-ahead by end of week? I'll take it from there.\n\nBest,\n${from}`,
      `If you're open to it, I'll book 15 minutes to walk you through the plan.\n\nBest,\n${from}`,
    ],
  };

  return {
    subject: pick(subjects[input.tone], seed),
    body: [
      pick(openings[input.tone], seed),
      pick(middles[input.tone], seed >> 2),
      pick(closings[input.tone], seed >> 4),
    ].join("\n\n"),
  };
}

export interface MeetingSummary {
  overview: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: { task: string; owner: string; deadline: string }[];
}

const OWNERS = ["Priya N.", "Daniel R.", "Sam O.", "Thandi M.", "Marcus L.", "Unassigned"];
const DEADLINES = [
  "This Friday",
  "Next Monday",
  "End of the week",
  "In two weeks",
  "Before the next review",
  "End of month",
];

function sentences(text: string) {
  return text
    .split(/[\n.•\-–]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 18);
}

export async function summarizeNotes(notes: string): Promise<MeetingSummary> {
  await delay(1100 + Math.random() * 800);
  const lines = sentences(notes);
  const seed = hash(notes);

  const fallbackPoints = [
    "Team reviewed current progress against the quarterly plan",
    "Capacity constraints were raised for the coming sprint",
    "Stakeholder feedback from last week was discussed",
  ];

  const keyPoints = (lines.length ? lines.slice(0, 5) : fallbackPoints).map((s) =>
    s.charAt(0).toUpperCase() + s.slice(1),
  );

  const decisionSource = lines.filter((l) =>
    /decid|agree|approv|will|confirm|sign off|go ahead/i.test(l),
  );
  const decisions = (decisionSource.length ? decisionSource : lines.slice(5, 8)).slice(0, 4);

  const actionSource = lines.filter((l) => /action|follow up|send|prepare|draft|review|share|schedule/i.test(l));
  const actionBase = (actionSource.length ? actionSource : lines.slice(0, 4)).slice(0, 5);

  const actionItems = (actionBase.length
    ? actionBase
    : ["Circulate the updated project plan", "Schedule the follow-up review", "Share the draft with stakeholders"]
  ).map((task, i) => ({
    task: task.charAt(0).toUpperCase() + task.slice(1),
    owner: pick(OWNERS, seed + i * 7),
    deadline: pick(DEADLINES, seed + i * 13),
  }));

  return {
    overview:
      lines.length > 0
        ? `The meeting focused on ${topic(notes).toLowerCase()}. The group aligned on priorities, resolved the open questions raised since the last session, and agreed a set of follow-up actions with named owners and target dates.`
        : "A short working session covering current status, open risks and next steps. Owners and target dates were agreed for each follow-up action.",
    keyPoints: keyPoints.slice(0, 5),
    decisions: (decisions.length
      ? decisions
      : ["Proceed with the current approach for this quarter", "Revisit resourcing at the next review"]
    ).map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    actionItems,
  };
}

export function summaryToText(s: MeetingSummary) {
  return [
    "SUMMARY",
    s.overview,
    "",
    "KEY DISCUSSION POINTS",
    ...s.keyPoints.map((p) => `• ${p}`),
    "",
    "DECISIONS MADE",
    ...s.decisions.map((d) => `• ${d}`),
    "",
    "ACTION ITEMS",
    ...s.actionItems.map((a) => `• ${a.task} — ${a.owner} (${a.deadline})`),
  ].join("\n");
}

export const SUGGESTED_PROMPTS = [
  "Draft a professional email",
  "Summarize these meeting notes",
  "Create a task list",
  "Help me prepare for a meeting",
];

export async function chatReply(prompt: string): Promise<string> {
  await delay(800 + Math.random() * 900);
  const p = prompt.toLowerCase();

  if (/email|draft|write to/.test(p)) {
    return `Here's a draft you can adapt:\n\n**Subject:** Quick update and next steps\n\nHi there,\n\nThanks for your patience while we worked through the details. Everything is on track, and I've outlined the next steps below:\n\n1. Confirm the final scope by Friday\n2. Share the revised timeline with the wider team\n3. Book a 20-minute review for early next week\n\nLet me know if you'd like anything adjusted before I send it.\n\nBest,\nAlex\n\nWant me to make it more formal, friendlier, or more persuasive? You can also use the Email Generator for full tone control.`;
  }

  if (/summar|notes|minutes|recap/.test(p)) {
    return `Paste the notes and I'll structure them. A typical summary comes back as:\n\n**Overview** — two or three sentences of context\n**Key discussion points** — the substance of the conversation\n**Decisions made** — what was actually settled\n**Action items** — task, owner and deadline for each\n\nFor longer transcripts, the Meeting Summarizer section handles them better and lets you edit the result inline.`;
  }

  if (/task|to-?do|list|plan my/.test(p)) {
    return `Here's a prioritised task list based on a typical workweek:\n\n**Today**\n1. Reply to the outstanding client thread\n2. Review the draft proposal and leave comments\n3. Confirm attendance for Thursday's planning session\n\n**This week**\n4. Prepare the quarterly progress update\n5. Close out the two open action items from Monday's meeting\n6. Block two hours of focus time for the roadmap write-up\n\n**Waiting on others**\n7. Budget sign-off — chasing on Wednesday\n\nWant this grouped by project or by urgency instead?`;
  }

  if (/meeting|prepare|agenda|1:1|one-on-one/.test(p)) {
    return `Here's a preparation checklist:\n\n**Before**\n• Write the single outcome you need from the meeting\n• Circulate a three-item agenda at least a day ahead\n• Re-read the last set of action items and their status\n\n**During**\n• Open with the outcome, not the background\n• Timebox each agenda item and note decisions as they happen\n• Assign an owner and a date to every action\n\n**After**\n• Send a five-line recap within the hour\n• Add the actions to your tracker\n\nTell me the meeting type and I'll draft a specific agenda.`;
  }

  const generic = [
    `Here's how I'd approach that:\n\n1. **Clarify the outcome** — what does "done" look like, and who decides?\n2. **Break it down** — three to five concrete steps with rough effort estimates.\n3. **Identify the blockers** — anything that depends on someone else should be started first.\n4. **Set a checkpoint** — a short review partway through beats a big surprise at the end.\n\nIf you share a little more context, I can turn this into a concrete plan, an email, or a task list.`,
    `Good question. A practical framing:\n\n• **What's the real constraint?** Usually it's time, clarity or a decision nobody has made yet.\n• **What's the smallest useful next step?** Something you could complete in under 30 minutes.\n• **Who needs to know?** A one-line update to the right person prevents most rework.\n\nHappy to draft the message, the agenda or the task breakdown — just say which.`,
  ];
  return pick(generic, hash(prompt));
}
