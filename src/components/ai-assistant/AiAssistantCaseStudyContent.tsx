import type { ReactNode } from "react";
import { CaseStudyClip, CaseStudyFigure } from "./CaseStudyMedia";
import "../../styles/ai-assistant.css";

export const aiAssistantSections = [
  { id: "brief", label: "Brief" },
  { id: "problem", label: "Problem" },
  { id: "my-role", label: "My Role" },
  { id: "process", label: "Process" },
  { id: "target-users", label: "Target Users" },
  { id: "research-synthesis", label: "Research & Synthesis" },
  { id: "solution-overview", label: "Solution Overview" },
  { id: "design-challenges", label: "Design Challenges" },
  { id: "approach-strategy", label: "Approach & Strategy" },
  { id: "early-explorations", label: "Explorations & Tradeoffs" },
  { id: "final-implementation", label: "Key Feature Walkthrough" },
  { id: "validation", label: "Prototype Review & Validation" },
  { id: "impact", label: "Design Outcomes" },
  { id: "learnings-reflections", label: "Learnings & Reflections" },
];

function Copy({ children }: { children: ReactNode }) {
  return <div className="ai-prose">{children}</div>;
}

function Insight({ title, children }: { title: string; children: ReactNode }) {
  return <div className="ai-insight"><h3>{title}</h3><p>{children}</p></div>;
}

function Feature({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <article className="ai-feature"><div className="ai-feature-heading"><span>{number}</span><h3>{title}</h3></div>{children}</article>;
}

const content: Record<string, ReactNode> = {
  brief: <Copy>
    <p>A failed migration, an unreachable host, or an intermittent management connection can send a network operator across inventory, alerts, metrics, and logs. The difficult part is connecting those signals to the affected object and deciding what to do next.</p>
    <p>From May to July 2026, I led the UX vision for bringing VCF AI Assistant into the Network Operations experience. The concept uses conversation to organize an investigation: identify the object, summarize what is happening, explain the findings, and present a reviewable next step.</p>
    <p>The focus is an operator’s path from a network symptom to an informed decision. Setup, session continuity, and control over remediation are part of that path. A failed vMotion is a useful example: the investigation can connect migration events with uplink changes, VMkernel throughput, and related host conditions.</p>
  </Copy>,

  problem: <>
    <Copy><p>The central design problem was preserving operational context while making complex diagnostics easier to work through. A fluent answer alone is insufficient when the user needs to understand which environment it concerns and what a proposed change could affect.</p></Copy>
    <div className="ai-card-grid ai-three">
      <Insight title="Signals are scattered">An investigation can cross object inventory, health checks, migration events, and management-network connectivity. The operator has to assemble the explanation.</Insight>
      <Insight title="Scope can be ambiguous">A host name in a sentence needs to resolve to the right object. An answer about the wrong host or cluster can sound plausible and still be unusable.</Insight>
      <Insight title="Advice can become action">A suggested fix may restart a service, reconnect hosts, or require a wider upgrade. The user needs to understand and choose the scope before proceeding.</Insight>
    </div>
  </>,

  "my-role": <Copy>
    <p>As <strong>UX Design Lead</strong>, my ownership centered on envisioning VCF AI Assistant in the <strong>Network Operations</strong> space. I focused on how the assistant could fit an operator’s existing mental model of objects, incidents, evidence, and follow-up work.</p>
    <ul>
      <li><strong>Frame the experience:</strong> connect conversational assistance to recognizable network troubleshooting tasks.</li>
      <li><strong>Shape the interaction model:</strong> explore object selection, parallel investigation sessions, and readable diagnostic results.</li>
      <li><strong>Define the decision points:</strong> make proposed remediation, its scope, and unresolved issues visible to the operator.</li>
    </ul>
    <p>The walkthrough illustrates that Network Operations direction using the shared VCF AI Assistant prototype as a foundation.</p>
  </Copy>,

  process: <>
    <Copy><p>I organized the concept around a complete investigation rather than an isolated chat exchange. Each stage has a specific question the interface needs to answer.</p></Copy>
    <div className="ai-flow" aria-label="Investigation design process">
      {[
        ["01", "Enter", "Is the assistant ready, and where do I start?"],
        ["02", "Scope", "Which object and incident am I investigating?"],
        ["03", "Understand", "What was checked, and what does it mean?"],
        ["04", "Decide", "What should happen next, and what needs my approval?"],
      ].map(([number, title, text]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}
    </div>
    <Copy><h3>Make the first-use handoff explicit</h3><p>The prototype separates operator entry from administrator configuration. Its first-use view names the prerequisites—activate Agentic Control Center, connect Private AI services, and select models—rather than presenting a chat box that cannot yet help.</p></Copy>
    <CaseStudyFigure name="setup-prerequisites" alt="First-use assistant screen listing activation and model-configuration prerequisites" caption="First use: explain the available experience and show which prerequisites need an administrator’s attention." />
    <details className="ai-disclosure"><summary>Explore the model-connection setup</summary>
      <Copy><p>Agentic Control Center provides the configuration entry point. The provider dialog separates the provider choice, API key, and endpoint. This keeps connection setup out of the operator’s troubleshooting conversation.</p></Copy>
      <CaseStudyFigure name="setup-provider" alt="Provider configuration dialog showing separate API key and API endpoint fields with no credentials entered" caption="Configuration view from the shared prototype. No live provider credentials are used in this walkthrough." />
    </details>
  </>,

  "target-users": <div className="ai-card-grid">
    <Insight title="Network operators and infrastructure administrators">Investigate connectivity and migration failures, identify affected objects, and understand what to check next. They need an answer they can inspect and relate to the network environment they manage.</Insight>
    <Insight title="Platform administrators">Enable the assistant and configure its model connections. They need a clear setup path and visible readiness states before handing the experience over to operational users.</Insight>
  </div>,

  "research-synthesis": <>
    <Copy>
      <p>The concept is grounded in the Network Operations use case and a detailed walkthrough of the broader VCF prototype. The workflow breaks into three recurring information needs:</p>
    </Copy>
    <div className="ai-table-wrap"><table className="ai-table"><thead><tr><th>Operator question</th><th>Design response</th></tr></thead><tbody>
      <tr><td>Which object are we talking about?</td><td>Searchable inventory and explicit object chips in the composer.</td></tr>
      <tr><td>How did the assistant reach this finding?</td><td>An inspectable investigation trail, followed by structured issues and recommendations.</td></tr>
      <tr><td>What happens if I proceed?</td><td>A scoped approval step that explains the proposed action and its consequences.</td></tr>
    </tbody></table></div>
    <Copy><p>These are design hypotheses to validate with network operators. The prototype provides interaction evidence; it does not establish customer adoption, diagnostic accuracy, or an improvement in resolution time.</p></Copy>
  </>,

  "solution-overview": <>
    <Copy><p>A single conversational workspace connects object context, diagnostic findings, and the next decision. Familiar operational references—hosts, vCenters, clusters, severity, and knowledge-base links—remain visible alongside the conversation.</p></Copy>
    <div className="ai-card-grid">
      <Insight title="Object-aware entry">Attach the affected host or other inventory object before asking a question. Suggested tasks help users discover the assistant’s scope.</Insight>
      <Insight title="Inspectable investigation">Show progress and intermediate checks, then organize findings into issues that can be expanded and reviewed.</Insight>
      <Insight title="Deliberate remediation">Explain the action, distinguish a full fix from a narrower intervention, and ask for approval at the decision point.</Insight>
      <Insight title="Recoverable context">Use named sessions and searchable history so moving to another investigation does not mean starting over.</Insight>
    </div>
    <a className="ai-text-link" href="#final-implementation">See the four feature walkthroughs <span aria-hidden="true">→</span></a>
  </>,

  "design-challenges": <div className="ai-challenge-list">
    <div><span className="ai-small-label">Context over time</span><h3>Session Management</h3><p>An operator may interrupt one investigation to check another. The concept treats each investigation as a named session, with a transcript that can be resumed from history. Closing a tab and deleting a conversation need distinct meanings.</p><p className="ai-design-decision"><strong>Design direction:</strong> preserve the thread of the incident while allowing parallel work.</p></div>
    <div><span className="ai-small-label">Context in a question</span><h3>Object Search</h3><p>Free text is flexible, but object identity needs to be explicit. The picker groups inventory by type and turns a selection into a removable chip, making the intended context visible before sending.</p><p className="ai-design-decision"><strong>Design direction:</strong> combine natural language with inspectable object references.</p></div>
    <div><span className="ai-small-label">Context at a decision</span><h3>Building Trust in AI-Generated Remediation Plans</h3><p>Trust depends on understanding what the assistant found and what it proposes to change. The review step presents scope choices and their tradeoffs. A narrower action should not make an unresolved root cause disappear from the explanation.</p><p className="ai-design-decision"><strong>Design direction:</strong> support informed approval and preserve visibility into remaining issues.</p></div>
  </div>,

  "approach-strategy": <Copy>
    <h3>Lead with the operator’s task</h3>
    <p>The entry prompts describe recognizable jobs—review issues, investigate a migration failure, inspect certificates—rather than requiring users to learn a new command language.</p>
    <h3>Reveal detail when it becomes useful</h3>
    <p>Object search appears beside the composer. Diagnostic steps can be inspected, issue details expand on demand, and remediation choices appear when the user reaches a change decision. The conversation stays connected to the task without exposing every control at once.</p>
    <h3>Keep explanation close to the next action</h3>
    <p>Severity, root-cause context, recommendations, and supporting references belong beside the finding. The investigation trail needs verifiable references: the affected object, the incident time window, and the relevant check results. The approval step then explains the chosen scope, including the implications of a partial fix.</p>
  </Copy>,

  "early-explorations": <>
    <Copy><p>The concept balances the convenience of conversation with the precision expected in network operations. These tradeoffs shape the proposed experience:</p></Copy>
    <div className="ai-table-wrap"><table className="ai-table"><thead><tr><th>Choice</th><th>Direction</th><th>Tradeoff to test</th></tr></thead><tbody>
      <tr><td>Free text alone vs. explicit object context</td><td>Free text plus inventory search and object chips.</td><td>Extra selection effort should reduce ambiguity without slowing familiar tasks.</td></tr>
      <tr><td>One long conversation vs. separate investigations</td><td>Named sessions with resumable history.</td><td>Users need to recognize the right thread without accumulating confusing tabs.</td></tr>
      <tr><td>Immediate automation vs. a review step</td><td>Review the scope and approve supported actions.</td><td>Approval should improve understanding, rather than become a habitual extra click.</td></tr>
      <tr><td>Full diagnostic detail vs. a concise answer</td><td>Structured findings with expandable evidence.</td><td>The essential context must remain visible when details are collapsed.</td></tr>
    </tbody></table></div>
  </>,

  "final-implementation": <>
    <Copy><p>These short, silent clips show the proposed interaction flow. They were captured from the shared prototype and adapted with Network Operations terminology and illustrative object data.</p></Copy>
    <Feature number="01" title="Bring the affected object into the conversation">
      <Copy><p>Search inventory, select the host, and keep its identity attached to the question. The object chip makes the intended scope visible before the operator submits a request about vMotion network failures.</p></Copy>
      <CaseStudyClip name="object-context-walkthrough" poster="object-context" title="Select a host and compose an object-scoped network troubleshooting question" caption="Object context: a host selection becomes an explicit reference in the conversation composer." steps={[
        "Open the inventory browser beside the composer.",
        "Search for the illustrative host esxi-07 and select it.",
        "The host appears as a chip alongside a question about vMotion network failures.",
      ]} />
    </Feature>
    <Feature number="02" title="Turn a network symptom into inspectable findings">
      <Copy><p>The assistant exposes investigation progress and then organizes the result into specific issues. The vMotion example connects the failed migration to network events, throughput, and related operational conditions. Expandable findings keep a long diagnostic answer navigable.</p></Copy>
      <CaseStudyClip name="network-triage-walkthrough" poster="network-findings" title="Follow the investigation of a vMotion network failure and inspect the findings" caption="Diagnostic concept: follow the checks, then review network-related findings and recommendations. Values shown are prototype data." steps={[
        "Submit the object-scoped vMotion troubleshooting question.",
        "Follow the visible analysis process as the prototype checks the environment.",
        "Review the issue summary and expand a network finding for its explanation and recommended checks.",
      ]} />
    </Feature>
    <Feature number="03" title="Make the remediation decision explicit">
      <Copy><p>In the management-connectivity example, the prototype distinguishes a complete fix from reachability-only and connectivity-only interventions. The operator can inspect the consequences and choose a narrower scope. The follow-up keeps the remaining issue visible.</p></Copy>
      <CaseStudyClip name="remediation-review-walkthrough" poster="remediation-review" title="Review remediation scope, select connectivity-only intervention, and inspect remaining issues" caption="Approval concept: select the scope before running a simulated action. A partial intervention preserves the unresolved root cause in the result." steps={[
        "Review the proposed remediation and the available scope choices.",
        "Select Connectivity issues only and inspect the stated limitation of that choice.",
        "Approve the simulated action and review the follow-up, including what remains unresolved.",
      ]} />
    </Feature>
    <Feature number="04" title="Keep an investigation recoverable">
      <Copy><p>A new incident can start in a separate session. Naming the thread and finding it in history gives the operator a route back to earlier context. Session management supports the investigation, rather than becoming a separate organizational task.</p></Copy>
      <CaseStudyClip name="session-continuity-walkthrough" poster="session-history" title="Create and name a Network Operations investigation session and find it in history" caption="Session continuity: name a new investigation and locate it alongside previous conversations." steps={[
        "Create a new session without losing the preceding investigation.",
        "Rename the session Network incident review.",
        "Open session history to find and resume an existing thread.",
      ]} />
    </Feature>
  </>,

  validation: <>
    <Copy><h3>Review the whole decision path</h3><p>The prototype review covered setup prerequisites, inventory selection, diagnostic responses, remediation scope, and session history. It also examined the unsupported-request response and the access-related entry states. These checks help identify where the interaction needs more clarity before customer validation.</p></Copy>
    <div className="ai-card-grid">
      <Insight title="Keep capability boundaries understandable">When a request falls outside the available skills, the prototype explains its scope and offers a route to the skills list. A plausible but unrelated answer would undermine the operator’s confidence.</Insight>
      <Insight title="Treat partial success as partial success">A connectivity-only intervention needs to preserve unresolved reachability or root-cause information. A success state should describe what changed, rather than imply that every issue is resolved.</Insight>
      <Insight title="Name the correct feature in recovery guidance">Reviewing the restricted-access state surfaced copy that referred to a different feature. The Network Operations experience needs to identify the assistant, explain the missing permission, and direct the user to the right administrator.</Insight>
    </div>
    <Copy><h3>Next validation with network operators</h3><p>Task-based sessions should test whether the concept supports correct decisions—not only whether participants can use the chat controls.</p></Copy>
    <div className="ai-table-wrap"><table className="ai-table"><thead><tr><th>Task</th><th>What to observe</th></tr></thead><tbody>
      <tr><td>Identify and attach the affected host.</td><td>Correct object selection, mistaken references, and recovery from an incorrect chip.</td></tr>
      <tr><td>Explain why a network finding matters.</td><td>Whether the participant can trace the recommendation back to supporting checks and evidence.</td></tr>
      <tr><td>Choose a remediation scope.</td><td>Understanding of the proposed action, its consequences, and the limitations of a partial fix.</td></tr>
      <tr><td>Resume an interrupted investigation.</td><td>Finding the correct session and recovering the relevant context.</td></tr>
    </tbody></table></div>
  </>,

  impact: <Copy>
    <p>The concept establishes a coherent direction for AI assistance in Network Operations: an investigation with a visible object, an inspectable explanation, a deliberate decision, and a recoverable history.</p>
    <ul>
      <li><strong>A clearer entry point:</strong> setup prerequisites and task-oriented prompts define how the experience starts.</li>
      <li><strong>A more concrete conversation:</strong> explicit object references connect questions to operational context.</li>
      <li><strong>A reviewable action boundary:</strong> scope choices and follow-up states make the remediation decision visible.</li>
    </ul>
    <p>The outcome presented here is a UX vision and prototype walkthrough. Production adoption, diagnostic accuracy, and changes in resolution time remain measures for future validation.</p>
  </Copy>,

  "learnings-reflections": <Copy>
    <h3>Object identity is part of the conversation</h3>
    <p>For network troubleshooting, the question is incomplete without its scope. Object selection and the resulting answer need to preserve the same reference throughout the investigation.</p>
    <h3>Explain the decision, not just the diagnosis</h3>
    <p>A user needs to know what a proposed action changes and what it leaves unresolved. Granular approval is useful only when the differences between the options are understandable.</p>
    <h3>Design for interruption</h3>
    <p>Operational work moves between incidents. Naming, history, and resumable context deserve the same attention as the assistant’s first response.</p>
  </Copy>,
};

export function AiAssistantCaseStudyContent() {
  return <>
    <div className="ai-intro">
      <h1 className="sr-only">AI Assistant for Network Operations</h1>
      <div className="ai-project-meta">
        {[
          ["Project Type", "UX vision & concept design"],
          ["My Role", "UX Design Lead"],
          ["Focus", "AI assistance in Network Operations"],
          ["Timeline", "May–July 2026"],
        ].map(([label, value]) => <div key={label}><p className="ai-meta-label">{label}</p><p className="ai-meta-value">{value}</p></div>)}
      </div>
      <div className="ai-framing">
        <p className="ai-eyebrow">Network Operations concept</p>
        <p className="ai-framing-statement">Help network operators move from a symptom to a decision while keeping the object, evidence, and control in view.</p>
        <p className="ai-context-note">Prototype views are adapted from the broader VCF AI Assistant experience. Network terminology and sample objects illustrate the proposed direction.</p>
        <a className="ai-text-link" href="#final-implementation">Watch the feature walkthroughs <span aria-hidden="true">→</span></a>
      </div>
    </div>
    {aiAssistantSections.map((section) => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="ai-section">
      <h2 id={`${section.id}-heading`} className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{section.label}</h2>
      {content[section.id]}
    </section>)}
  </>;
}
