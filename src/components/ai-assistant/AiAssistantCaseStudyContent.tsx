import type { ReactNode } from "react";
import { ArrowRight, ClipboardCheck, Compass, KeyRound, ListChecks, PanelsTopLeft, Search } from "lucide-react";
import { CaseStudyClip, CaseStudyFigure } from "./CaseStudyMedia";
import { DesignExplorations } from "./DesignExplorations";
import { SuccessMetrics, TargetUsersAndPainPoints } from "./ProjectFramework";
import { InvestigationMap, ResearchSynthesisMap, StrategyFlow } from "./InvestigationDiagrams";
import "../../styles/ai-assistant.css";

export const aiAssistantSections = [
  { id: "brief", label: "Brief" },
  { id: "problem", label: "Problem" },
  { id: "goal", label: "Goal" },
  { id: "target-users", label: "Target Users & Pain Points" },
  { id: "research-synthesis", label: "Research & Synthesis" },
  { id: "approach-strategy", label: "Design Strategy" },
  { id: "early-explorations", label: "Design Explorations" },
  { id: "final-implementation", label: "Final Solution" },
  { id: "success-metrics", label: "Success Metrics" },
  { id: "validation", label: "Validation" },
  { id: "impact", label: "Outcome & Reflection" },
];

function Copy({ children }: { children: ReactNode }) {
  return <div className="ai-prose">{children}</div>;
}

function Feature({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <article className="ai-feature"><div className="ai-feature-heading"><span>{number}</span><h3>{title}</h3></div>{children}</article>;
}

const content: Record<string, ReactNode> = {
  brief: <>
    <Copy><p>A failed migration can send a network operator across inventory, alerts, and logs. I envisioned how Network AI Assistant within VCF Operations could bring that investigation into one conversational workspace—keeping the affected object, supporting evidence, and next decision visible.</p><p>As UX Design Lead, I focused on the Network Operations experience: how an operator starts an investigation, evaluates a recommendation, and returns to interrupted work.</p></Copy>
    <a className="ai-text-link" href="#final-implementation">Explore the final solution <ArrowRight size={19} aria-hidden="true" /></a>
  </>,

  problem: <>
    <Copy><p>The broader VCF exploration moved from scanning health dashboards to prioritizing active issues. The next challenge was helping an operator investigate those issues without repeatedly moving between inventory, alerts, and diagnostic detail.</p><p>For Network Operations, a useful answer needs to establish <strong>which object</strong> it concerns, <strong>what supports the diagnosis</strong>, and <strong>what the next action will change</strong>.</p></Copy>
    <InvestigationMap />
  </>,

  goal: <>
    <Copy><p>Help network operators move from an infrastructure symptom to a justified next action in one workspace. The experience should reduce time spent reconstructing context while keeping the affected object, diagnostic evidence, and remediation scope visible.</p><p>For VCF Operations, the opportunity is to turn monitoring insights into guided investigation. Operators should be able to understand a recommendation, decide whether to approve it, and resume unfinished work without starting over.</p></Copy>
  </>,

  "target-users": <TargetUsersAndPainPoints />,

  "research-synthesis": <>
    <Copy><p>The shared design review and prototype explored how operators return to work, identify an object, and understand a diagnosis. Together, these patterns point to a common need: preserve context across the investigation.</p></Copy>
    <ResearchSynthesisMap />
  </>,

  "approach-strategy": <>
    <Copy><p>I framed the Network Operations experience around one investigation: preserve its context, make the diagnostic path understandable, and keep approval deliberate.</p></Copy>
    <StrategyFlow />
  </>,

  "early-explorations": <DesignExplorations />,

  "final-implementation": <>
    <Copy><p>The workspace connects object scope, evidence, action, continuity, and model choice.</p></Copy>
    <p className="ai-note">Adapted prototype views use illustrative network data and simulated actions.</p>
    <article className="ai-feature ai-setup" id="setup" aria-labelledby="setup-heading">
      <div className="ai-feature-heading"><span>01</span><h3 id="setup-heading">Supporting the first-use experience</h3></div>
      <Copy><p>Before operators can investigate, administrators need a clear setup path. The entry screen identifies prerequisites; Agentic Control Center separates provider configuration from daily troubleshooting.</p></Copy>
      <div className="ai-setup-grid">
        <CaseStudyFigure name="setup-prerequisites" version="console-blue-first-use" alt="Network AI Assistant welcome screen with a networking illustration and two setup cards for activation and model configuration" caption="Explain readiness before inviting the operator to ask a question." />
        <CaseStudyFigure name="setup-provider" version="network-name" alt="Model provider configuration with separate, empty API key and endpoint fields" caption="Give administrators a dedicated place to configure the model connection." />
      </div>
    </article>
    <Feature number="02" title="Choose a model for the investigation">
      <Copy><p>Keep model choice beside the prompt so operators can see their options without leaving an investigation. The prototype groups provider models separately from Private AI Services for corporate environments.</p></Copy>
      <CaseStudyClip name="model-selection-walkthrough" poster="model-selector-private-ai" version="smooth-30fps" title="Browse the model selector and reveal Private AI Services" caption="Browse provider models, then scroll within the same menu to reveal Private AI Services." steps={[
        "Open Gemini 2.5 Pro beside the composer.",
        "Browse the Anthropic, Google Gemini, and OpenAI groups.",
        "Scroll to Private AI Services: Gemini 2.5 Pro, gemini-flash-latest, and openai/gpt-oss-120b.",
      ]} />
    </Feature>
    <Feature number="03" title="Start with the affected object">
      <Copy><p>The walkthrough uses inventory search as a visible starting point. Attach the host before asking about a vMotion failure; the object chip keeps the selected scope in the question.</p></Copy>
      <CaseStudyClip name="object-context-walkthrough" poster="object-context" version="smooth-30fps" title="Select a host and compose a network troubleshooting question" caption="Search from the main assistant workspace, then keep the selected host attached to the question." steps={[
        "Open inventory search beside the composer.",
        "Select esxi-07 and confirm the host chip.",
        "Ask about the most recent vMotion network failures.",
      ]} />
    </Feature>
    <Feature number="04" title="Move from symptoms to evidence">
      <Copy><p>Explain the purpose of diagnostic checks as the investigation progresses, then group the findings by issue. The operator can inspect the evidence and recommendation together before deciding what to do.</p></Copy>
      <CaseStudyClip name="network-triage-walkthrough" poster="network-findings" version="smooth-30fps" title="Investigate a vMotion network failure and inspect its findings" caption="Expand a network finding to connect the symptom with supporting evidence." steps={[
        "Submit the object-scoped vMotion question.",
        "Follow the investigation as checks appear.",
        "Expand the network finding and review its recommended checks.",
      ]} />
    </Feature>
    <Feature number="05" title="Make the next action a decision">
      <Copy><p>A second scenario explores restoring management connectivity. Compare remediation scopes before approval; after a partial fix, the remaining issue stays visible.</p></Copy>
      <CaseStudyClip name="remediation-review-walkthrough" poster="remediation-review" version="smooth-30fps" title="Compare remediation scope and review unresolved issues after a partial fix" caption="Connectivity-only remediation resolves one issue while preserving the remaining root cause." steps={[
        "Review the proposed remediation and scope choices.",
        "Choose Connectivity issues only and read its limitation.",
        "Approve the simulated action, then inspect what remains unresolved.",
      ]} />
    </Feature>
    <Feature number="06" title="Return with context intact">
      <Copy><p>The prototype carries forward top tabs for active work and searchable history for earlier sessions. Naming an investigation gives the operator a recognizable route back after an interruption.</p></Copy>
      <CaseStudyClip name="session-continuity-walkthrough" poster="session-history" version="smooth-30fps" title="Name an investigation and resume a previous conversation from history" caption="A named session provides a recognizable route back to the incident." steps={[
        "Start a separate session for another investigation.",
        "Name it Network incident review.",
        "Use history to find and resume an earlier thread.",
      ]} />
    </Feature>
  </>,

  "success-metrics": <SuccessMetrics />,

  validation: <>
    <Copy><p>The prototype walkthrough checked normal flows, unsupported requests, and partial completion. The next round should compare the design alternatives with network operators and test whether the explanations support sound decisions.</p></Copy>
    <div className="ai-validation-grid">
      <div><h3>What the review surfaced</h3><ul role="list">
        <li><Compass size={24} aria-hidden="true" /><span><strong>Capability boundaries:</strong> unsupported requests need a clear route to available skills.</span></li>
        <li><ListChecks size={24} aria-hidden="true" /><span><strong>Partial success:</strong> the result must distinguish what changed from what remains unresolved.</span></li>
        <li><KeyRound size={24} aria-hidden="true" /><span><strong>Recovery copy:</strong> the restricted-access state references another feature; guidance should name the assistant and the required permission.</span></li>
      </ul></div>
      <div><h3>What to test next</h3><ul role="list">
        <li><PanelsTopLeft size={24} aria-hidden="true" /><span><strong>Session navigation:</strong> compare tabs and a sidebar as the number of active incidents grows.</span></li>
        <li><Search size={24} aria-hidden="true" /><span><strong>Object selection:</strong> check discovery of search and @ references, including similarly named hosts.</span></li>
        <li><ClipboardCheck size={24} aria-hidden="true" /><span><strong>Diagnostic understanding:</strong> compare checks alone with explained checks; ask operators to justify the scope and consequences before approval.</span></li>
      </ul></div>
    </div>
  </>,

  impact: <>
    <Copy><p>This work gave the Network Operations vision a coherent path from choosing an object to returning to unfinished work. It is still a prototype: I can point to the design decisions and interactions, but I cannot yet claim faster resolution or stronger operator trust.</p></Copy>
    <div className="ai-reflection-aspect">
      <h3>Keep the tradeoffs visible</h3>
      <Copy><p>Tabs protect the space needed for diagnostic detail, but a growing set of investigations may be harder to navigate. Short explanations help scanning, but can hide useful evidence. I would keep summaries concise while preserving a direct path to the supporting checks.</p></Copy>
    </div>
    <div className="ai-reflection-aspect">
      <h3>Evaluate decisions under pressure</h3>
      <Copy><p>I would test interrupted investigations, similar object names, and partial fixes with network operators. I would ask them to explain the affected scope, justify a next action, and identify what remains unresolved. Those decisions would tell me more than whether the interface feels easy to use.</p></Copy>
    </div>
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
    {aiAssistantSections.map((section) => {
      return <section key={section.id} id={section.id} tabIndex={-1} aria-labelledby={`${section.id}-heading`} className="ai-section">
        <h2 id={`${section.id}-heading`} className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{section.label}</h2>
        {content[section.id]}
      </section>;
    })}
  </>;
}
