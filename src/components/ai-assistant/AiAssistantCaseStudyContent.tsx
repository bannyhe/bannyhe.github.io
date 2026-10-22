import { localize } from "../../i18n/locale";
import type { ReactNode } from "react";
import { ArrowRight, ClipboardCheck, Clock3, Compass, KeyRound, ListChecks, PanelsTopLeft, Search } from "lucide-react";
import { CaseStudyClip, CaseStudyFigure } from "./CaseStudyMedia";
import { DesignExplorations } from "./DesignExplorations";
import { MetricConnection, SolutionImpact, SuccessMetrics, TargetUsersAndPainPoints } from "./ProjectFramework";
import type { MetricKind } from "./MetricIllustration";
import { InvestigationMap, ResearchSynthesisMap, StrategyFlow } from "./InvestigationDiagrams";
import "../../styles/ai-assistant.css";

export const aiAssistantSections = [
  { id: "brief", label: "Brief" },
  { id: "problem", label: "Problem" },
  { id: "goal", label: "Goal" },
  { id: "target-users", label: "Target Users & Pain Points" },
  { id: "success-metrics", label: "Success Metrics" },
  { id: "research-synthesis", label: "Research & Synthesis" },
  { id: "approach-strategy", label: "Design Strategy" },
  { id: "early-explorations", label: "Design Explorations" },
  { id: "final-implementation", label: "Final Solution" },
  { id: "impact", label: "Impact" },
  { id: "validation", label: "Validation" },
  { id: "reflection", label: "Outcome & Reflection" },
];

function Copy({ children }: { children: ReactNode }) {
  return <div className="ai-prose">{localize(children)}</div>;
}

function Feature({ id, number, title, metric, children }: { id: string; number: string; title: string; metric?: MetricKind; children: ReactNode }) {
  return <article id={id} tabIndex={-1} aria-labelledby={`${id}-heading`} className="ai-feature"><div className="ai-feature-heading"><span>{localize(number)}</span><h3 id={`${id}-heading`}>{localize(title)}</h3></div>{localize(metric && <MetricConnection kind={metric} />)}{localize(children)}</article>;
}

const content: Record<string, ReactNode> = {
  brief: <>
    <Copy><p>{localize("A failed migration can send a network operator across inventory, alerts, and logs. I envisioned how Network AI Assistant within VCF Operations could bring that investigation into one conversational workspace—keeping the affected object, supporting evidence, and next decision visible.")}</p><p>{localize("As UX Design Lead, I focused on the Network Operations experience: how an operator starts an investigation, evaluates a recommendation, and returns to interrupted work.")}</p></Copy>
    <a className="ai-text-link" href="#final-implementation">{localize("Explore the final solution ")}<ArrowRight size={19} aria-hidden="true" /></a>
  </>,

  problem: <>
    <Copy><p>{localize("When a network issue interrupts a workload, finding the cause can mean piecing together clues from several screens. An operator checks the affected host, follows an alert, then digs through logs—all while keeping track of what’s already been ruled out.")}</p><p>{localize("An AI answer is only useful if the operator can make sense of it. They need to understand ")}<strong>{localize("what supports the diagnosis")}</strong>, <strong>{localize("what a suggested fix will change")}</strong>{localize(", and ")}<strong>{localize("what still needs attention")}</strong>.</p></Copy>
    <InvestigationMap />
  </>,

  goal: <>
    <Copy><p>{localize("I wanted troubleshooting to feel like one continuous conversation. An operator could start with the affected host, ask what went wrong, and see the relevant findings together, without having to rebuild the story across dashboards.")}</p><p>{localize("From there, they could review a suggested fix, understand its impact, and choose what to do next. If another incident interrupted them, they could return to the same investigation and pick up where they left off.")}</p></Copy>
  </>,

  "target-users": <TargetUsersAndPainPoints />,

  "success-metrics": <SuccessMetrics />,

  "research-synthesis": <>
    <Copy><p>{localize("The shared design review and prototype explored how operators return to work, identify an object, and understand a diagnosis. Together, these patterns point to a common need: preserve context across the investigation.")}</p></Copy>
    <ResearchSynthesisMap />
  </>,

  "approach-strategy": <>
    <Copy><p>{localize("I framed the Network Operations experience around one investigation: preserve its context, make the diagnostic path understandable, and keep approval deliberate.")}</p></Copy>
    <StrategyFlow />
  </>,

  "early-explorations": <DesignExplorations />,

  "final-implementation": <>
    <Copy><p>{localize("The walkthrough follows the same goals as the success metrics: choose the right object, understand the evidence, review a fix, and return to unfinished work. Setup and model choice prepare the workspace; the four investigation features show how those goals take shape.")}</p></Copy>
    <p className="ai-note">{localize("Adapted prototype views use illustrative network data and simulated actions.")}</p>
    <article className="ai-feature ai-setup" id="setup" aria-labelledby="setup-heading">
      <div className="ai-feature-heading"><span>01</span><h3 id="setup-heading">{localize("Supporting the first-use experience")}</h3></div>
      <Copy><p>{localize("Before operators can investigate, administrators need a clear setup path. The entry screen identifies prerequisites; Agentic Control Center separates provider configuration from daily troubleshooting.")}</p></Copy>
      <div className="ai-setup-grid">
        <CaseStudyFigure name="setup-prerequisites" version="console-blue-first-use" alt={localize("Network AI Assistant welcome screen with a networking illustration and two setup cards for activation and model configuration")} caption={localize("Explain readiness before inviting the operator to ask a question.")} />
        <CaseStudyFigure name="setup-provider" version="network-name" alt={localize("Model provider configuration with separate, empty API key and endpoint fields")} caption={localize("Give administrators a dedicated place to configure the model connection.")} />
      </div>
    </article>
    <Feature id="model-choice" number="02" title={localize("Choose a model for the investigation")}>
      <Copy><p>{localize("Keep model choice beside the prompt so operators can see their options without leaving an investigation. The prototype groups provider models separately from Private AI Services for corporate environments.")}</p></Copy>
      <CaseStudyClip name="model-selection-walkthrough" poster="model-selector-private-ai" version="smooth-30fps" title={localize("Browse the model selector and reveal Private AI Services")} caption={localize("Browse provider models, then scroll within the same menu to reveal Private AI Services.")} steps={[
        "Open Gemini 2.5 Pro beside the composer.",
        "Browse the Anthropic, Google Gemini, and OpenAI groups.",
        "Scroll to Private AI Services: Gemini 2.5 Pro, gemini-flash-latest, and openai/gpt-oss-120b.",
      ]} />
    </Feature>
    <Feature id="object-scope" metric="selection" number="03" title={localize("Start with the affected object")}>
      <Copy><p>{localize("Operators can search inventory and attach a host before asking about a vMotion failure. The visible host chip gives them a chance to check that the question concerns the right object before sending it.")}</p></Copy>
      <CaseStudyClip name="object-context-walkthrough" poster="object-context" version="smooth-30fps" title={localize("Select a host and compose a network troubleshooting question")} caption={localize("Search from the main assistant workspace, then keep the selected host attached to the question.")} steps={[
        "Open inventory search beside the composer.",
        "Select esxi-07 and confirm the host chip.",
        "Ask about the most recent vMotion network failures.",
      ]} />
    </Feature>
    <Feature id="diagnostic-evidence" metric="diagnosis" number="04" title={localize("Move from symptoms to evidence")}>
      <Copy><p>{localize("Brief explanations show why each diagnostic check matters, and findings are grouped by issue. Keeping evidence beside the recommendation is intended to help operators reach a supported diagnosis with less searching across screens.")}</p></Copy>
      <CaseStudyClip name="network-triage-walkthrough" poster="network-findings" version="smooth-30fps" title={localize("Investigate a vMotion network failure and inspect its findings")} caption={localize("Expand a network finding to connect the symptom with supporting evidence.")} steps={[
        "Submit the object-scoped vMotion question.",
        "Follow the investigation as checks appear.",
        "Expand the network finding and review its recommended checks.",
      ]} />
    </Feature>
    <Feature id="remediation-decision" metric="decision" number="05" title={localize("Make the next action a decision")}>
      <Copy><p>{localize("In the management-connectivity scenario, operators compare remediation scopes before approving a change. The explanation makes the limits of a connectivity-only fix clear; afterward, the unresolved issue stays visible so a partial fix is not mistaken for a complete resolution.")}</p></Copy>
      <CaseStudyClip name="remediation-review-walkthrough" poster="remediation-review" version="smooth-30fps" title={localize("Compare remediation scope and review unresolved issues after a partial fix")} caption={localize("Connectivity-only remediation resolves one issue while preserving the remaining root cause.")} steps={[
        "Review the proposed remediation and scope choices.",
        "Choose Connectivity issues only and read its limitation.",
        "Approve the simulated action, then inspect what remains unresolved.",
      ]} />
    </Feature>
    <Feature id="session-continuity" metric="continuity" number="06" title={localize("Return with context intact")}>
      <Copy><p>{localize("Named investigations make earlier work recognizable in tabs and searchable history. Operators can reopen the conversation, review its findings, and work out what to do next without reconstructing the investigation from memory.")}</p></Copy>
      <CaseStudyClip name="session-continuity-walkthrough" poster="session-history" version="smooth-30fps" title={localize("Name an investigation and resume a previous conversation from history")} caption={localize("A named session provides a recognizable route back to the incident.")} steps={[
        "Start a separate session for another investigation.",
        "Name it Network incident review.",
        "Use history to find and resume an earlier thread.",
      ]} />
    </Feature>
  </>,

  impact: <SolutionImpact />,

  validation: <>
    <Copy><p>{localize("The prototype walkthrough checked normal flows, unsupported requests, and partial completion. Next, I would compare matched incident tasks in the assistant and the current console, using the success metrics to check time, correctness, and understanding.")}</p></Copy>
    <div className="ai-validation-grid">
      <div><h3>{localize("What the review surfaced")}</h3><ul role="list">
        <li><Compass size={24} aria-hidden="true" /><span><strong>{localize("Capability boundaries:")}</strong>{localize(" unsupported requests need a clear route to available skills.")}</span></li>
        <li><ListChecks size={24} aria-hidden="true" /><span><strong>{localize("Partial success:")}</strong>{localize(" the result must distinguish what changed from what remains unresolved.")}</span></li>
        <li><KeyRound size={24} aria-hidden="true" /><span><strong>{localize("Recovery copy:")}</strong>{localize(" the restricted-access state references another feature; guidance should name the assistant and the required permission.")}</span></li>
      </ul></div>
      <div><h3>{localize("What to test next")}</h3><ul role="list">
        <li><PanelsTopLeft size={24} aria-hidden="true" /><span><strong>{localize("Session continuity:")}</strong>{localize(" interrupt an investigation, then time how quickly operators find the right session and identify the next unresolved step.")}</span></li>
        <li><Search size={24} aria-hidden="true" /><span><strong>{localize("Object selection:")}</strong>{localize(" check first-attempt accuracy without help, including discovery of search and @ references with similarly named hosts.")}</span></li>
        <li><Clock3 size={24} aria-hidden="true" /><span><strong>{localize("Supported diagnosis:")}</strong>{localize(" compare time to a diagnosis with the current workflow, checking the evidence and accuracy of each answer.")}</span></li>
        <li><ClipboardCheck size={24} aria-hidden="true" /><span><strong>{localize("Remediation decisions:")}</strong>{localize(" ask operators to explain the scope, expected change, and remaining issues before approving an action.")}</span></li>
      </ul></div>
    </div>
  </>,

  reflection: <>
    <Copy><p>{localize("The key design challenge was deciding how much context to keep visible. Operators need a short path to the next step, with enough evidence to judge whether that step makes sense.")}</p></Copy>
    <div className="ai-reflection-aspect">
      <h3>{localize("Keep the tradeoffs visible")}</h3>
      <Copy><p>{localize("Tabs protect the space needed for diagnostic detail, but a growing set of investigations may be harder to navigate. Short explanations help scanning, but can hide useful evidence. I would keep summaries concise while preserving a direct path to the supporting checks.")}</p></Copy>
    </div>
    <div className="ai-reflection-aspect">
      <h3>{localize("Evaluate decisions under pressure")}</h3>
      <Copy><p>{localize("I would test interrupted investigations, similar object names, and partial fixes with network operators. I would ask them to explain the affected scope, justify a next action, and identify what remains unresolved. Those decisions would tell me more than whether the interface feels easy to use.")}</p></Copy>
    </div>
  </>,
};

export function AiAssistantCaseStudyContent() {
  return <>
    <div className="ai-project-meta">
      {localize([
        ["Project Type", "UX vision & concept design"],
        ["My Role", "UX Design Lead"],
        ["Focus", "AI in Network Operations"],
        ["Timeline", "May–July 2026"],
      ].map(([label, value]) => <div key={label}><p className="ai-meta-label">{localize(label)}</p><p className="ai-meta-value">{localize(value)}</p></div>))}
    </div>
    {localize(aiAssistantSections.map((section) => {
      return <section key={section.id} id={section.id} tabIndex={-1} aria-labelledby={`${section.id}-heading`} className="ai-section">
        <h2 id={`${section.id}-heading`} className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize(section.label)}</h2>
        {localize(content[section.id])}
      </section>;
    }))}
  </>;
}
