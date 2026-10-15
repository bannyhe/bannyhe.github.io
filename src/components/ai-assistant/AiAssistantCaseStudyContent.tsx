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
    <div className="ai-map-decision"><ShieldCheck aria-hidden="true" /><strong>A reviewed next step</strong><p>Choose the scope.<br />Keep control.</p></div>
    <figcaption>Design goal: carry the same context from the first question to the next decision.</figcaption>
  </figure>;
}

const content: Record<string, ReactNode> = {
  brief: <>
    <Copy><p>A failed migration can send a network operator across inventory, alerts, and logs. I envisioned how VCF AI Assistant could bring that investigation into one conversational workspace—keeping the affected object, supporting evidence, and next decision visible.</p><p>As UX Design Lead, I focused on the Network Operations experience: how an operator starts an investigation, evaluates a recommendation, and returns to interrupted work.</p></Copy>
    <a className="ai-text-link" href="#final-implementation">Explore the final solution <ArrowRight size={19} aria-hidden="true" /></a>
  </>,

  problem: <>
    <Copy><p>The hard part is connecting a symptom to a trustworthy next step. A helpful answer needs to establish <strong>which object</strong> it concerns, <strong>what supports the diagnosis</strong>, and <strong>what a proposed action will change</strong>.</p></Copy>
    <InvestigationMap />
  </>,

  "research-synthesis": <>
    <Copy><p>A scenario-based review of the VCF prototype covered object search, diagnosis, remediation, and session recovery. Three observations shaped the Network Operations direction.</p></Copy>
    <div className="ai-evidence-list">
      {[
        ["01", "Object context", "The composer accepts inventory objects alongside natural language.", "Keep the host identity visible before and after the question."],
        ["02", "Diagnostic detail", "One investigation produces multiple checks, issues, and recommendations.", "Summarize first; reveal evidence at the point of review."],
        ["03", "Action scope", "Remediation can address only part of a problem.", "Explain the limits of each choice and retain unresolved issues."],
      ].map(([number, title, observation, implication]) => <article className="ai-evidence-row" key={number}>
        <div className="ai-evidence-title"><span className="ai-small-label">{number}</span><h3>{title}</h3></div>
        <div><span className="ai-small-label">Observed in the prototype</span><p>{observation}</p></div>
        <div><span className="ai-small-label">Design implication</span><p>{implication}</p></div>
      </article>)}
    </div>
    <p className="ai-note">Method: prototype and workflow analysis. These directions remain hypotheses for validation with network operators.</p>
  </>,

  "approach-strategy": <>
    <Copy><p>I framed the experience around an investigation, with three design priorities: make context explicit, make evidence readable, and make action deliberate.</p></Copy>
    <ol className="ai-process">
      {[
        ["Map the task", "Follow the operator from a network symptom to a decision. Identify where context can be lost."],
        ["Examine the decisions", "Review object selection, diagnostic detail, approval choices, and interruption states."],
        ["Shape the experience", "Connect those moments through object references, structured findings, and resumable sessions."],
      ].map(([title, description], index) => <li key={title}><span className="ai-small-label">0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}
    </ol>
    <Copy><p>The primary user is the network operator investigating an incident. Platform administrators own readiness and model setup; that handoff belongs before the troubleshooting conversation.</p></Copy>
  </>,

  "early-explorations": <DesignExplorations />,

  "final-implementation": <>
    <Copy><p>Four moments connect the investigation: scope, evidence, action, and continuity.</p></Copy>
    <p className="ai-note">Adapted prototype views use illustrative network data and simulated actions.</p>
    <Feature number="01" title="Start with the affected object">
      <Copy><p>Search inventory and attach the host before asking about a vMotion failure. The visible object reference makes the investigation’s scope clear.</p></Copy>
      <CaseStudyClip name="object-context-walkthrough" poster="object-context" title="Select a host and compose a network troubleshooting question" caption="The selected host stays attached to the question." steps={[
        "Open inventory search beside the composer.",
        "Select esxi-07 and confirm the host chip.",
        "Ask about the most recent vMotion network failures.",
      ]} />
    </Feature>
    <Feature number="02" title="Move from symptoms to evidence">
      <Copy><p>Follow the diagnostic checks, then expand a finding to inspect the explanation and recommended next steps. A structured answer makes a complex investigation easier to scan.</p></Copy>
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
      <Copy><p>Operational work gets interrupted. Named sessions and history let an operator move between incidents and resume the earlier investigation.</p></Copy>
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
    <Copy><p>The walkthrough review examined normal flows, unsupported requests, and partial completion. The next round should test decision quality with network operators.</p></Copy>
    <div className="ai-validation-grid">
      <div><h3>What the review surfaced</h3><ul>
        <li><strong>Capability boundaries:</strong> unsupported requests need a clear route to available skills.</li>
        <li><strong>Partial success:</strong> the result must distinguish what changed from what remains unresolved.</li>
        <li><strong>Recovery copy:</strong> the restricted-access state references another feature; guidance should name the assistant and the required permission.</li>
      </ul></div>
      <div><h3>What to test next</h3><ul>
        <li><strong>Scope:</strong> can operators select the right host and notice an incorrect reference?</li>
        <li><strong>Understanding:</strong> can they explain the evidence and consequences before approving an action?</li>
        <li><strong>Continuity:</strong> can they resume the right incident after an interruption?</li>
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
