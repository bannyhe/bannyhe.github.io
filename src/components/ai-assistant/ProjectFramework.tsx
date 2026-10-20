import { History, PanelsTopLeft, ShieldCheck } from "lucide-react";
import { PersonaAvatar } from "./PersonaAvatar";
import { MetricIllustration, type MetricKind } from "./MetricIllustration";

const painPoints = [
  {
    icon: PanelsTopLeft,
    title: "Fragmented investigation",
    pain: "Moving between inventory, alerts, and logs makes it harder to keep evidence tied to the affected object.",
    need: "Keep object scope and relevant findings together as the conversation develops.",
  },
  {
    icon: ShieldCheck,
    title: "Uncertain recommendations",
    pain: "An AI-generated answer is difficult to act on when its supporting checks, proposed scope, or limitations are unclear.",
    need: "Explain the evidence and consequences before approval; distinguish a partial fix from a resolved incident.",
  },
  {
    icon: History,
    title: "Interrupted work",
    pain: "Switching incidents can leave operators reconstructing the earlier question, completed checks, and unresolved issues.",
    need: "Make investigations recognizable and preserve their history and next steps.",
  },
];

const metrics: { kind: MetricKind; title: string; outcome: string; measure: string }[] = [
  {
    kind: "diagnosis",
    title: "Find the cause sooner",
    outcome: "Spend less time searching for clues while still reaching a diagnosis backed by evidence.",
    measure: "Median time to a supported diagnosis, compared with the current workflow, while maintaining accuracy.",
  },
  {
    kind: "selection",
    title: "Start with the right object",
    outcome: "Help operators pick the intended host or vCenter, even when names look alike.",
    measure: "How often the correct object is selected on the first attempt, without a facilitator’s help.",
  },
  {
    kind: "decision",
    title: "Understand before approving",
    outcome: "Make it clear what a suggested fix will change and what it will leave unresolved.",
    measure: "How often operators correctly explain the scope, expected change, and remaining issues before approval.",
  },
  {
    kind: "continuity",
    title: "Pick up where you left off",
    outcome: "Return to an interrupted investigation without repeating checks or losing earlier findings.",
    measure: "Median time to find the right session and identify the next unresolved step after an interruption.",
  },
];

export function TargetUsersAndPainPoints() {
  return <>
    <div className="ai-prose"><p>The primary user is a network operator responsible for monitoring connectivity and troubleshooting infrastructure issues. A platform administrator supports the experience by preparing access and model configuration.</p></div>
    <div className="ai-framework-grid ai-user-profiles">
      <article className="ai-concept-node">
        <div className="ai-persona-heading">
          <PersonaAvatar role="operator" />
          <div><p className="ai-framework-label">Primary user</p><h3 className="ai-node-heading">Network operator</h3></div>
        </div>
        <p>Investigates connectivity and vMotion failures, correlates health signals, and decides which checks or actions to take.</p>
        <p><strong>Needs:</strong> fast object discovery, understandable evidence, and a reliable way to return to an active incident.</p>
      </article>
      <article className="ai-concept-node">
        <div className="ai-persona-heading">
          <PersonaAvatar role="administrator" />
          <div><p className="ai-framework-label">Supporting user</p><h3 className="ai-node-heading">Platform administrator</h3></div>
        </div>
        <p>Prepares assistant access, connects model providers, and configures model availability for the environment.</p>
        <p><strong>Needs:</strong> clear prerequisites, permission guidance, and a distinct setup path for provider models or Private AI Services.</p>
      </article>
    </div>
    <h3 className="ai-framework-subheading">Pain points shaping the experience</h3>
    <p className="ai-note">Working hypotheses from the design review and prototype scenarios, to validate with network operators.</p>
    <dl className="ai-pain-points">
      {painPoints.map(({ icon: Icon, title, pain, need }) => <div key={title}>
        <dt><Icon size={24} aria-hidden="true" /><span>{title}</span></dt>
        <dd><p>{pain}</p><p><strong>Design need:</strong> {need}</p></dd>
      </div>)}
    </dl>
  </>;
}

export function SuccessMetrics() {
  return <>
    <div className="ai-prose"><p>In discussions with the PM and Engineering Lead, we focused on how the assistant could make everyday troubleshooting easier. That meant helping operators find the right issue sooner, understand a suggested fix, and return to unfinished work with less effort.</p></div>
    <p className="ai-note">Planned evaluation measures; results and numeric targets are still to be established.</p>
    <div className="ai-framework-grid ai-metrics-grid">
      {metrics.map(({ kind, title, outcome, measure }) => <article key={kind} className="ai-metric">
        <div className="ai-metric-heading">
          <MetricIllustration kind={kind} />
          <h3 className="ai-node-heading">{title}</h3>
        </div>
        <p>{outcome}</p>
        <p className="ai-metric-measure"><strong>How to measure:</strong> {measure}</p>
      </article>)}
    </div>
    <p className="ai-note">In a pilot, repeat use and task satisfaction would also help us understand how well the assistant fits into everyday work.</p>
  </>;
}
