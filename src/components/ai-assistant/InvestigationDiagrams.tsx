import { ArrowDown, ArrowRight, Database, Focus, History, ListChecks, Search, Settings2, ShieldCheck, Undo2, type LucideIcon } from "lucide-react";

function NodeHeading({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return <h3 className="ai-node-heading"><Icon size={24} aria-hidden="true" /><span>{children}</span></h3>;
}

export function InvestigationMap() {
  return <figure className="ai-visual-panel" aria-label="From operational signals to one investigation and a reviewed next step">
    <div className="ai-problem-flow">
      <div className="ai-concept-node">
        <NodeHeading icon={Database}>Gather the clues</NodeHeading>
        <p>Bring inventory, alerts, logs, and events together.</p>
      </div>
      <ArrowRight className="ai-flow-arrow" aria-hidden="true" />
      <div className="ai-concept-node">
        <NodeHeading icon={Search}>Understand the issue</NodeHeading>
        <p>Connect the affected object with evidence and a clear explanation.</p>
      </div>
      <ArrowRight className="ai-flow-arrow" aria-hidden="true" />
      <div className="ai-concept-node">
        <NodeHeading icon={ShieldCheck}>Choose the next step</NodeHeading>
        <p>Review the recommendation and decide what to change.</p>
      </div>
    </div>
    <figcaption>Carry the same context from the first question to the next decision.</figcaption>
  </figure>;
}

export function ResearchSynthesisMap() {
  return <figure className="ai-visual-panel ai-synthesis-map" aria-label="Three design observations converge on preserving investigation context">
    <div className="ai-synthesis-branches">
      <div className="ai-synthesis-branch">
        <NodeHeading icon={History}>Session continuity</NodeHeading>
        <div className="ai-pattern-pair"><span>Tabs + history</span><span className="ai-pattern-relation">or</span><span>Session sidebar</span></div>
        <p>Keep past work accessible without crowding the diagnosis.</p>
        <ArrowDown className="ai-synthesis-arrow" aria-hidden="true" />
      </div>
      <div className="ai-synthesis-branch">
        <NodeHeading icon={Focus}>Object context</NodeHeading>
        <div className="ai-pattern-pair"><span>Inventory search</span><span className="ai-pattern-relation">+</span><span>@ references</span></div>
        <p>Support discovery and direct entry; preserve the selected object.</p>
        <ArrowDown className="ai-synthesis-arrow" aria-hidden="true" />
      </div>
      <div className="ai-synthesis-branch">
        <NodeHeading icon={ListChecks}>Diagnostic trust</NodeHeading>
        <div className="ai-pattern-pair"><span>Checks alone</span><ArrowDown className="ai-pattern-relation" size={18} aria-hidden="true" /><span>Checks + explanations</span></div>
        <p>Connect each check to its purpose, evidence, and next step.</p>
        <ArrowDown className="ai-synthesis-arrow" aria-hidden="true" />
      </div>
    </div>
    <div className="ai-synthesis-principle">
      <span className="ai-small-label">Shared design principle</span>
      <strong>Keep the investigation’s context visible.</strong>
      <p>Preserve the selected scope, supporting evidence, and unfinished work throughout the conversation.</p>
    </div>
    <figcaption>Synthesis of the shared design review and prototype. These implications remain hypotheses to test with network operators.</figcaption>
  </figure>;
}

export function StrategyFlow() {
  return <figure className="ai-visual-panel ai-strategy-map" aria-label="An administrator prepares access; the operator scopes, diagnoses, reviews, and verifies an investigation, returning to unresolved findings">
    <div className="ai-strategy-readiness">
      <Settings2 size={24} aria-hidden="true" />
      <div><span className="ai-small-label">Platform administrator</span><p>Prepare access and the model connection.</p></div>
    </div>
    <div className="ai-strategy-handoff"><ArrowDown size={22} aria-hidden="true" /><span>Ready for investigation</span></div>
    <div className="ai-strategy-workspace">
      <span className="ai-small-label">Network operator · one continuous investigation</span>
      <div className="ai-strategy-flow">
        <div className="ai-concept-node"><NodeHeading icon={Focus}>Scope</NodeHeading><p>Attach the affected host or vCenter.</p></div>
        <ArrowRight className="ai-flow-arrow" aria-hidden="true" />
        <div className="ai-concept-node"><NodeHeading icon={Search}>Diagnose</NodeHeading><p>Inspect checks, evidence, and explanations.</p></div>
        <ArrowRight className="ai-flow-arrow" aria-hidden="true" />
        <div className="ai-concept-node"><NodeHeading icon={ShieldCheck}>Review</NodeHeading><p>Choose the scope and approve a proposed action.</p></div>
        <ArrowRight className="ai-flow-arrow" aria-hidden="true" />
        <div className="ai-concept-node"><NodeHeading icon={ListChecks}>Verify</NodeHeading><p>Check what changed and what remains open.</p></div>
      </div>
      <div className="ai-strategy-return"><Undo2 size={24} aria-hidden="true" /><p><strong>Still unresolved?</strong> Carry the findings into the next question in the same investigation.</p></div>
    </div>
    <figcaption>Object references, evidence, and session history carry across the workflow—even when an investigation pauses or a fix is partial.</figcaption>
  </figure>;
}
