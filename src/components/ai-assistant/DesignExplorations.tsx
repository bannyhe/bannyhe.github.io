import type { ReactNode } from "react";
import { ArrowUp, Check, ChevronDown, Clock3, Search, Server, Sparkles } from "lucide-react";
import "../../styles/ai-explorations.css";

function MockWindowHeader({ children }: { children: ReactNode }) {
  return <div className="ai-explore-window-label"><Sparkles size={14} aria-hidden="true" /><span>{children}</span></div>;
}

function MockComposer({ children = "Ask a network question…" }: { children?: ReactNode }) {
  return <div className="ai-explore-composer"><span>{children}</span><ArrowUp size={14} aria-hidden="true" /></div>;
}

function SessionTabsDiagram() {
  return <div className="ai-explore-wireframe" role="img" aria-label="Session tabs keep vMotion triage and Management connectivity at the top. A separate history menu lists previous investigations.">
    <MockWindowHeader>Network AI Assistant</MockWindowHeader>
    <div className="ai-explore-session-tabs"><span className="ai-explore-tab-active">vMotion triage</span><span>Management connectivity</span><Clock3 size={14} aria-hidden="true" /></div>
    <div className="ai-explore-tabs-body">
      <div className="ai-explore-chat-preview"><span className="ai-explore-object"><Server size={13} aria-hidden="true" />esxi-07</span><p>Investigate the latest vMotion failure.</p><div className="ai-explore-text-lines" aria-hidden="true"><span /><span /></div></div>
      <div className="ai-explore-history"><span className="ai-explore-mini-heading">Session history</span><span className="ai-explore-history-active">vMotion triage</span><span>Management connectivity</span><span>Host network review</span></div>
    </div>
    <MockComposer />
  </div>;
}

function SessionSidebarDiagram() {
  return <div className="ai-explore-wireframe" role="img" aria-label="A persistent sidebar lists vMotion triage, Management connectivity, and Host network review beside a narrower conversation.">
    <MockWindowHeader>Network AI Assistant</MockWindowHeader>
    <div className="ai-explore-sidebar-layout">
      <div className="ai-explore-sidebar"><div className="ai-explore-search"><Search size={13} aria-hidden="true" /><span>Search</span></div><span>New session</span><span className="ai-explore-history-active">vMotion triage</span><span>Management connectivity</span><span>Host network review</span></div>
      <div className="ai-explore-sidebar-conversation"><div className="ai-explore-chat-preview"><span className="ai-explore-object"><Server size={13} aria-hidden="true" />esxi-07</span><p>Investigate the latest vMotion failure.</p><div className="ai-explore-text-lines" aria-hidden="true"><span /><span /></div></div><MockComposer /></div>
    </div>
  </div>;
}

function InventorySearchDiagram() {
  return <div className="ai-explore-wireframe" role="img" aria-label="Inventory search displays a search field, a Hosts group with esxi-07 and esxi-09, and a Clusters group. The selected host appears as a reference in the composer.">
    <MockWindowHeader>Find an object</MockWindowHeader>
    <div className="ai-explore-object-menu">
      <div className="ai-explore-search"><Search size={13} aria-hidden="true" /><span>Search inventory…</span></div>
      <span className="ai-explore-mini-heading">Hosts</span>
      <div className="ai-explore-object-row ai-explore-object-row-selected"><Server size={13} aria-hidden="true" /><span>esxi-07</span><Check size={13} aria-hidden="true" /></div>
      <div className="ai-explore-object-row"><Server size={13} aria-hidden="true" /><span>esxi-09</span></div>
      <span className="ai-explore-mini-heading">Clusters</span>
      <div className="ai-explore-object-row"><span>Network cluster</span></div>
    </div>
    <MockComposer><span className="ai-explore-object"><Server size={13} aria-hidden="true" />esxi-07</span></MockComposer>
  </div>;
}

function ObjectMentionDiagram() {
  return <div className="ai-explore-wireframe" role="img" aria-label="Typing @host in a troubleshooting question opens matching host suggestions, including esxi-07 and esxi-09, directly above the composer.">
    <MockWindowHeader>Reference while typing</MockWindowHeader>
    <p className="ai-explore-mention-hint">Type @host to reference a host.</p>
    <div className="ai-explore-object-menu ai-explore-mention-menu">
      <span className="ai-explore-mini-heading">Hosts</span>
      <div className="ai-explore-object-row ai-explore-object-row-selected"><Server size={13} aria-hidden="true" /><span>esxi-07</span><span className="ai-explore-object-type">Host</span></div>
      <div className="ai-explore-object-row"><Server size={13} aria-hidden="true" /><span>esxi-09</span><span className="ai-explore-object-type">Host</span></div>
    </div>
    <MockComposer>Troubleshoot <span className="ai-explore-mention-token">@host</span></MockComposer>
  </div>;
}

const diagnosticChecks = [
  { title: "Connect to the environment", detail: "Read the current network state", explanation: "Live data avoids relying on a stale snapshot." },
  { title: "Build object context", detail: "Match events to esxi-07", explanation: "Relate each event to a known inventory object." },
  { title: "Correlate network signals", detail: "Review events and alarms together", explanation: "Related signals may span more than one object." },
];

function DiagnosticChecksDiagram({ stage }: { stage: "checks" | "boxed" | "inline" }) {
  const description = stage === "checks"
    ? "Three diagnostic checks show status and activity, with no explanation of their purpose."
    : stage === "boxed"
      ? "Each diagnostic check includes an explanatory paragraph in its own shaded box."
      : "Short explanations sit between diagnostic checks, forming one continuous investigation trail.";
  return <div className={`ai-explore-wireframe ai-explore-diagnostics ai-explore-diagnostics-${stage}`} role="img" aria-label={description}>
    <MockWindowHeader>Analysis process<ChevronDown size={13} aria-hidden="true" /></MockWindowHeader>
    <div className="ai-explore-check-list">{diagnosticChecks.map(item => <div className="ai-explore-check-step" key={item.title}>
      <div className="ai-explore-check-row"><span className="ai-explore-check-icon"><Check size={11} aria-hidden="true" /></span><div><span className="ai-explore-check-title">{item.title}</span><span className="ai-explore-check-detail">{item.detail}</span></div></div>
      {stage !== "checks" && <div className="ai-explore-explanation"><Sparkles size={12} aria-hidden="true" /><p>{item.explanation}</p></div>}
    </div>)}</div>
  </div>;
}

function ExplorationCard({ label, title, children, caption }: { label: string; title: string; children: ReactNode; caption: string }) {
  return <figure className="ai-explore-card"><div className="ai-explore-card-header"><span>{label}</span><h4>{title}</h4></div>{children}<figcaption>{caption}</figcaption></figure>;
}

function ExplorationPanel({ number, id, title, problem, children, takeaway, takeawayLabel = "Tradeoff" }: { number: string; id: string; title: string; problem: string; children: ReactNode; takeaway: string; takeawayLabel?: string }) {
  return <article className="ai-explore-panel" aria-labelledby={`exploration-${id}-heading`}>
    <div className="ai-explore-heading"><span>{number}</span><h3 id={`exploration-${id}-heading`}>{title}</h3></div>
    <p className="ai-explore-problem">{problem}</p>
    {children}
    <p className="ai-explore-tradeoff"><span>{takeawayLabel}</span>{takeaway}</p>
  </article>;
}

export function DesignExplorations() {
  return <div className="ai-explore">
    <div className="ai-explore-intro"><p>The shared VCF review compared navigation and object entry, then iterated on diagnostic explanations. These simplified views apply those patterns to Network Operations.</p></div>
    <ExplorationPanel number="01" id="sessions" title="Keep investigations within reach"
      problem="Operators may revisit one investigation while starting another. The review compared two places for session navigation."
      takeaway="Tabs preserve conversation width and keep a few investigations close. A persistent list makes past sessions visible while giving the conversation less space.">
      <div className="ai-explore-comparison">
        <ExplorationCard label="Option 1" title="Top tabs + history" caption="Active investigations sit above the conversation; earlier sessions are available through history."><SessionTabsDiagram /></ExplorationCard>
        <ExplorationCard label="Option 2" title="Persistent sidebar" caption="Past investigations stay visible beside the conversation."><SessionSidebarDiagram /></ExplorationCard>
      </div>
    </ExplorationPanel>
    <ExplorationPanel number="02" id="references" title="Bring the right object into the question"
      problem="A troubleshooting question needs a specific inventory reference. The review explored a visible search entry and a shortcut inside the composer."
      takeaway="Search makes object types discoverable; @ mentions keep a known reference in the flow of typing. Both can lead to an explicit object chip.">
      <div className="ai-explore-comparison">
        <ExplorationCard label="Option 1" title="Search the inventory" caption="Browse object groups and select the host before continuing the question."><InventorySearchDiagram /></ExplorationCard>
        <ExplorationCard label="Option 2" title="Use an @ mention" caption="Type a reference in the question and choose from matching objects."><ObjectMentionDiagram /></ExplorationCard>
      </div>
    </ExplorationPanel>
    <ExplorationPanel number="03" id="diagnostics" title="Explain the purpose behind each check"
      problem="Completed checks show progress, but do not explain why a check matters. Three versions explored where to place that explanation."
      takeawayLabel="Design progression"
      takeaway="The final review stage separates explanations from the check containers. The aim is a readable investigation trail, with context where the operator needs it.">
      <div className="ai-explore-comparison ai-explore-comparison-three">
        <ExplorationCard label="Original" title="Checks only" caption="Status communicates what is happening; the purpose of each check is implicit."><DiagnosticChecksDiagram stage="checks" /></ExplorationCard>
        <ExplorationCard label="V1" title="Boxed explanations" caption="Explanatory text adds context inside a separate visual container for each check."><DiagnosticChecksDiagram stage="boxed" /></ExplorationCard>
        <ExplorationCard label="Current in the review" title="Inline explanations" caption="Brief explanations follow the checks as part of a continuous reading sequence."><DiagnosticChecksDiagram stage="inline" /></ExplorationCard>
      </div>
    </ExplorationPanel>
  </div>;
}
