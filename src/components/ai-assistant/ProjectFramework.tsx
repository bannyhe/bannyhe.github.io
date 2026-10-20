import { Clock3, Focus, History, Network, PanelsTopLeft, Settings2, ShieldCheck } from "lucide-react";

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

const metrics = [
  {
    icon: Clock3,
    title: "Time to a supported diagnosis",
    measure: "Median time from receiving an incident scenario to identifying a diagnosis supported by evidence.",
    signal: "Less time than the existing console workflow, with diagnosis accuracy maintained.",
  },
  {
    icon: Focus,
    title: "Correct object selection",
    measure: "Share of tasks where the operator selects the intended host or vCenter on the first attempt, without a facilitator’s help.",
    signal: "Fewer wrong-object selections, including when names are similar.",
  },
  {
    icon: ShieldCheck,
    title: "Informed remediation decisions",
    measure: "Share of tasks where the operator correctly explains the proposed scope, expected change, and remaining issues before approval.",
    signal: "More decisions supported by evidence, with fewer approvals based on a misunderstood scope.",
  },
  {
    icon: History,
    title: "Recovery after interruption",
    measure: "Median time to find the right session and identify the next unresolved step after a planned interruption.",
    signal: "Faster resumption with fewer repeated checks or lost findings.",
  },
];

export function TargetUsersAndPainPoints() {
  return <>
    <div className="ai-prose"><p>The primary user is a network operator responsible for monitoring connectivity and troubleshooting infrastructure issues. A platform administrator supports the experience by preparing access and model configuration.</p></div>
    <div className="ai-framework-grid ai-user-profiles">
      <article className="ai-concept-node">
        <p className="ai-framework-label">Primary user</p>
        <h3 className="ai-node-heading"><Network size={24} aria-hidden="true" /><span>Network operator</span></h3>
        <p>Investigates connectivity and vMotion failures, correlates health signals, and decides which checks or actions to take.</p>
        <p><strong>Needs:</strong> fast object discovery, understandable evidence, and a reliable way to return to an active incident.</p>
      </article>
      <article className="ai-concept-node">
        <p className="ai-framework-label">Supporting user</p>
        <h3 className="ai-node-heading"><Settings2 size={24} aria-hidden="true" /><span>Platform administrator</span></h3>
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
    <div className="ai-prose"><p>Success means reaching a well-supported decision with less effort. I would compare the assistant with the current console workflow using equivalent incident scenarios, including similar object names, partial fixes, and interrupted investigations.</p></div>
    <p className="ai-note">Proposed evaluation measures, not measured outcomes. Establish a baseline before setting numeric targets; balance speed with correctness.</p>
    <div className="ai-framework-grid ai-metrics-grid">
      {metrics.map(({ icon: Icon, title, measure, signal }) => <article key={title} className="ai-metric">
        <h3 className="ai-node-heading"><Icon size={24} aria-hidden="true" /><span>{title}</span></h3>
        <p>{measure}</p>
        <p><strong>Success signal:</strong> {signal}</p>
      </article>)}
    </div>
    <div className="ai-prose ai-pilot-measures"><p>In a pilot, I would also track repeat use across eligible incidents and task satisfaction to understand whether the assistant earns a place in everyday Network Operations.</p></div>
  </>;
}
