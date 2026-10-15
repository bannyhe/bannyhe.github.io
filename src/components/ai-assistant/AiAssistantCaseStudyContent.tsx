import type { ReactNode } from "react";
import { ArrowRight, Database, FileText, Network, ShieldCheck } from "lucide-react";
import { CaseStudyClip, CaseStudyFigure } from "./CaseStudyMedia";
import { DesignExplorations } from "./DesignExplorations";
import "../../styles/ai-assistant.css";

export const aiAssistantSections = [
  { id: "brief", label: "Brief" },
  { id: "problem", label: "Problem" },
  { id: "research-synthesis", label: "Research & Synthesis" },
  { id: "approach-strategy", label: "Design Strategy" },
  { id: "early-explorations", label: "Design Explorations" },
  { id: "final-implementation", label: "Final Solution" },
  { id: "validation", label: "Validation" },
  { id: "impact", label: "Outcome & Reflection" },
];

function Copy({ children }: { children: ReactNode }) {
  return <div className="ai-prose">{children}</div>;
}

function Feature({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <article className="ai-feature"><div className="ai-feature-heading"><span>{number}</span><h3>{title}</h3></div>{children}</article>;
}

function InvestigationMap() {
  return <figure className="ai-investigation-map" aria-label="Design direction: connect scattered operational signals to a scoped investigation and a reviewed action">
    <div className="ai-map-sources">
      <span className="ai-small-label">Operational signals</span>
      <div><span><Database aria-hidden="true" /> Inventory</span><span><Network aria-hidden="true" /> Alerts & metrics</span><span><FileText aria-hidden="true" /> Logs & events</span></div>
    </div>
    <ArrowRight className="ai-map-arrow" aria-hidden="true" />
    <div className="ai-map-investigation"><span className="ai-small-label">One investigation</span><strong>What happened to this host?</strong><span className="ai-object-chip"><Network size={17} aria-hidden="true" /> esxi-07</span><p>Object + evidence + explanation</p></div>
    <ArrowRight className="ai-map-arrow" aria-hidden="true" />
    <div className="ai-map-decision"><ShieldCheck aria-hidden="true" /><strong>A reviewed next step</strong><p>Choose the scope. Keep control.</p></div>
    <figcaption>Design goal: carry the same context from the first question to the next decision.</figcaption>
  </figure>;
}

const content: Record<string, ReactNode> = {
  brief: <>
    <Copy><p>A failed migration can send a network operator across inventory, alerts, and logs. I envisioned how VCF AI Assistant could bring that investigation into one conversational workspace—keeping the affected object, supporting evidence, and next decision visible.</p><p>As UX Design Lead, I focused on the Network Operations experience: how an operator starts an investigation, evaluates a recommendation, and returns to interrupted work.</p></Copy>
    <a className="ai-text-link" href="#final-implementation">Explore the final solution <ArrowRight size={19} aria-hidden="true" /></a>
  </>,

  problem: <>
    <Copy><p>The broader VCF exploration moved from scanning health dashboards to prioritizing active issues. The next challenge was helping an operator investigate those issues without repeatedly moving between inventory, alerts, and diagnostic detail.</p><p>For Network Operations, a useful answer needs to establish <strong>which object</strong> it concerns, <strong>what supports the diagnosis</strong>, and <strong>what the next action will change</strong>.</p></Copy>
    <InvestigationMap />
  </>,

  "research-synthesis": <>
    <Copy><p>Reviewing the shared VCF design walkthrough alongside the interactive prototype surfaced three questions for the Network Operations experience.</p></Copy>
    <div className="ai-evidence-list">
      {[
        ["01", "Session continuity", "The review compares top tabs with history against a persistent session sidebar.", "Keep active incidents accessible without crowding diagnostic content."],
        ["02", "Object context", "Inventory search and @ references offer two ways to identify an object.", "Support discovery and direct entry, then make the selected scope visible."],
        ["03", "Diagnostic trust", "The explanation evolves from checks alone to rationale alongside the checks.", "Connect the purpose of a check to its evidence and recommended action."],
      ].map(([number, title, observation, implication]) => <article className="ai-evidence-row" key={number}>
        <div className="ai-evidence-title"><span className="ai-small-label">{number}</span><h3>{title}</h3></div>
        <div><span className="ai-small-label">Seen in the design review</span><p>{observation}</p></div>
        <div><span className="ai-small-label">Design implication</span><p>{implication}</p></div>
      </article>)}
    </div>
    <p className="ai-note">Sources: the shared VCF design review and prototype walkthrough. The comparisons document design decisions; operator research and measured outcomes remain to be validated.</p>
  </>,

  "approach-strategy": <>
    <Copy><p>I framed the Network Operations experience around one investigation: preserve its context, make the diagnostic path understandable, and keep approval deliberate.</p></Copy>
    <ol className="ai-process">
      {[
        ["Map the investigation", "Trace a network symptom through object selection, diagnosis, review, and return."],
        ["Compare the patterns", "Examine navigation space, object discovery, and the placement of diagnostic explanations."],
        ["Connect the workflow", "Carry object references and evidence into a scoped action, then preserve the conversation for later."],
      ].map(([title, description], index) => <li key={title}><span className="ai-small-label">0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}
    </ol>
    <Copy><p>The primary user is the network operator investigating an incident. Platform administrators own readiness and model setup; that handoff belongs before the troubleshooting conversation.</p></Copy>
  </>,

  "early-explorations": <DesignExplorations />,

  "final-implementation": <>
    <Copy><p>Four moments connect the investigation: scope, evidence, action, and continuity.</p></Copy>
    <p className="ai-note">Adapted prototype views use illustrative network data and simulated actions.</p>
    <Feature number="01" title="Start with the affected object">
      <Copy><p>The walkthrough uses inventory search as a visible starting point. Attach the host before asking about a vMotion failure; the object chip keeps the selected scope in the question.</p></Copy>
      <CaseStudyClip name="object-context-walkthrough" poster="object-context" title="Select a host and compose a network troubleshooting question" caption="The selected host stays attached to the question." steps={[
        "Open inventory search beside the composer.",
        "Select esxi-07 and confirm the host chip.",
        "Ask about the most recent vMotion network failures.",
      ]} />
    </Feature>
    <Feature number="02" title="Move from symptoms to evidence">
      <Copy><p>Explain the purpose of diagnostic checks as the investigation progresses, then group the findings by issue. The operator can inspect the evidence and recommendation together before deciding what to do.</p></Copy>
      <CaseStudyClip name="network-triage-walkthrough" poster="network-findings" title="Investigate a vMotion network failure and inspect its findings" caption="Expand a network finding to connect the symptom with supporting evidence." steps={[
        "Submit the object-scoped vMotion question.",
        "Follow the investigation as checks appear.",
        "Expand the network finding and review its recommended checks.",
      ]} />
    </Feature>
    <Feature number="03" title="Make the next action a decision">
      <Copy><p>A second scenario explores restoring management connectivity. Compare remediation scopes before approval; after a partial fix, the remaining issue stays visible.</p></Copy>
      <CaseStudyClip name="remediation-review-walkthrough" poster="remediation-review" title="Compare remediation scope and review unresolved issues after a partial fix" caption="Connectivity-only remediation resolves one issue while preserving the remaining root cause." steps={[
        "Review the proposed remediation and scope choices.",
        "Choose Connectivity issues only and read its limitation.",
        "Approve the simulated action, then inspect what remains unresolved.",
      ]} />
    </Feature>
    <Feature number="04" title="Return with context intact">
      <Copy><p>The prototype carries forward top tabs for active work and searchable history for earlier sessions. Naming an investigation gives the operator a recognizable route back after an interruption.</p></Copy>
      <CaseStudyClip name="session-continuity-walkthrough" poster="session-history" title="Name an investigation and resume a previous conversation from history" caption="A named session provides a recognizable route back to the incident." steps={[
        "Start a separate session for another investigation.",
        "Name it Network incident review.",
        "Use history to find and resume an earlier thread.",
      ]} />
    </Feature>
    <details className="ai-disclosure" id="setup">
      <summary>Supporting the first-use experience</summary>
      <Copy><p>Before operators can investigate, administrators need a clear setup path. The entry screen identifies prerequisites; Agentic Control Center separates provider configuration from daily troubleshooting.</p></Copy>
      <CaseStudyFigure name="setup-prerequisites" alt="Assistant entry screen listing activation and model setup prerequisites" caption="Explain readiness before inviting the operator to ask a question." />
      <CaseStudyFigure name="setup-provider" alt="Model provider configuration with separate, empty API key and endpoint fields" caption="Give administrators a dedicated place to configure the model connection." />
    </details>
  </>,

  validation: <>
    <Copy><p>The prototype walkthrough checked normal flows, unsupported requests, and partial completion. The next round should compare the design alternatives with network operators and test whether the explanations support sound decisions.</p></Copy>
    <div className="ai-validation-grid">
      <div><h3>What the review surfaced</h3><ul>
        <li><strong>Capability boundaries:</strong> unsupported requests need a clear route to available skills.</li>
        <li><strong>Partial success:</strong> the result must distinguish what changed from what remains unresolved.</li>
        <li><strong>Recovery copy:</strong> the restricted-access state references another feature; guidance should name the assistant and the required permission.</li>
      </ul></div>
      <div><h3>What to test next</h3><ul>
        <li><strong>Session navigation:</strong> compare tabs and a sidebar as the number of active incidents grows.</li>
        <li><strong>Object selection:</strong> check discovery of search and @ references, including similarly named hosts.</li>
        <li><strong>Diagnostic understanding:</strong> compare checks alone with explained checks; ask operators to justify the scope and consequences before approval.</li>
      </ul></div>
    </div>
  </>,

  impact: <>
    <Copy><p>The outcome is a UX vision for bringing AI assistance into Network Operations: a scoped conversation, inspectable findings, deliberate approval, and recoverable context. Operator validation and production impact remain next steps.</p></Copy>
    <div className="ai-takeaway"><span className="ai-small-label">Key reflection</span><p>Trust grows when operators can explain the recommendation—and what it leaves unresolved.</p></div>
  </>,
};

export function AiAssistantCaseStudyContent() {
  return <>
    <div className="ai-project-meta">
      {[
        ["Project Type", "UX vision & concept design"],
        ["My Role", "UX Design Lead"],
        ["Focus", "AI in Network Operations"],
        ["Timeline", "May–July 2026"],
      ].map(([label, value]) => <div key={label}><p className="ai-meta-label">{label}</p><p className="ai-meta-value">{value}</p></div>)}
    </div>
    {aiAssistantSections.map((section) => <section key={section.id} id={section.id} tabIndex={-1} aria-labelledby={`${section.id}-heading`} className="ai-section">
      <h2 id={`${section.id}-heading`} className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{section.label}</h2>
      {content[section.id]}
    </section>)}
  </>;
}
