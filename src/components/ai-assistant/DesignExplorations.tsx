import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Check, ChevronDown, ChevronRight, Search, Server } from "lucide-react";
import "../../styles/ai-explorations.css";

const explorations = [
  {
    id: "context",
    label: "Object context",
    alternative: "Infer the object from text",
    direction: "Make the object explicit",
    alternativeCaption: "A typed name has no confirmed inventory match.",
    directionCaption: "The selected host, esxi-07, stays attached to the question.",
    tradeoff: "Inventory selection adds a step; it confirms the object behind the typed name.",
  },
  {
    id: "evidence",
    label: "Evidence",
    alternative: "Explain everything at once",
    direction: "Reveal detail by issue",
    alternativeCaption: "The finding and its supporting checks compete for attention.",
    directionCaption: "A vMotion finding expands to show related events and throughput.",
    tradeoff: "Progressive disclosure keeps the summary readable; supporting evidence remains one step away.",
  },
  {
    id: "remediation",
    label: "Remediation",
    alternative: "Offer a single approval",
    direction: "Make the scope a choice",
    alternativeCaption: "One approval applies the complete proposed plan.",
    directionCaption: "Connectivity-only remediation leaves the unresolved root cause visible.",
    tradeoff: "Choosing a narrower scope adds a decision and requires a clear account of what remains unresolved.",
  },
] as const;

type ExplorationId = typeof explorations[number]["id"];

function ObjectContext({ proposed }: { proposed: boolean }) {
  return <>
    <div className="ai-explore-window-label"><span className="ai-explore-status-dot" />Network Operations</div>
    {proposed ? <>
      <div className="ai-explore-inventory"><Search size={13} /><span>Find an inventory object</span></div>
      <div className="ai-explore-composer">
        <span className="ai-explore-object"><Server size={13} />esxi-07<Check size={12} /></span>
        <p>Why did the latest vMotion fail?</p>
        <span className="ai-explore-send"><ArrowRight size={14} /></span>
      </div>
    </> : <>
      <div className="ai-explore-blank-lines"><span /><span /></div>
      <div className="ai-explore-composer">
        <p>Why did vMotion fail on esxi-07?</p>
        <span className="ai-explore-annotation">Object identity unconfirmed</span>
        <span className="ai-explore-send"><ArrowRight size={14} /></span>
      </div>
    </>}
  </>;
}

function Evidence({ proposed }: { proposed: boolean }) {
  return <>
    <div className="ai-explore-window-label"><span className="ai-explore-status-dot" />Investigation · esxi-07</div>
    {proposed ? <div className="ai-explore-issue-stack">
      <div className="ai-explore-issue">
        <div className="ai-explore-issue-heading"><span className="ai-explore-severity" />vMotion connectivity<ChevronDown size={14} /></div>
        <div className="ai-explore-evidence"><span>Uplink change preceded the failure</span><div className="ai-explore-sparkline"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><small>Inspect events and throughput</small></div>
      </div>
      <div className="ai-explore-issue ai-explore-issue-heading"><span className="ai-explore-neutral-dot" />Related host conditions<ChevronRight size={14} /></div>
    </div> : <div className="ai-explore-answer">
      <p>The migration failed. Review the host’s uplink changes, VMkernel throughput, and related events to understand the network conditions.</p>
      <div className="ai-explore-text-lines"><span /><span /><span /><span /></div>
    </div>}
  </>;
}

function Remediation({ proposed }: { proposed: boolean }) {
  return <>
    <div className="ai-explore-window-label"><span className="ai-explore-status-dot" />Review the next step</div>
    {proposed ? <>
      <div className="ai-explore-choice"><span className="ai-explore-radio" /><span>Full remediation</span></div>
      <div className="ai-explore-choice ai-explore-choice-selected"><span className="ai-explore-radio"><i /></span><span>Connectivity issues only</span><Check size={13} /></div>
      <div className="ai-explore-scope-note">Root cause remains unresolved</div>
      <span className="ai-explore-action">Approve selected scope<ArrowRight size={13} /></span>
    </> : <>
      <div className="ai-explore-answer ai-explore-answer-short"><p>Apply the recommended remediation plan.</p><div className="ai-explore-text-lines"><span /><span /><span /></div></div>
      <span className="ai-explore-action">Approve &amp; run<ArrowRight size={13} /></span>
    </>}
  </>;
}

function Wireframe({ id, proposed }: { id: ExplorationId; proposed: boolean }) {
  return <div className={`ai-explore-wireframe${proposed ? " ai-explore-wireframe-proposed" : ""}`} aria-hidden="true">
    {id === "context" && <ObjectContext proposed={proposed} />}
    {id === "evidence" && <Evidence proposed={proposed} />}
    {id === "remediation" && <Remediation proposed={proposed} />}
  </div>;
}

export function DesignExplorations() {
  const instanceId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight": nextIndex = (index + 1) % explorations.length; break;
      case "ArrowLeft": nextIndex = (index - 1 + explorations.length) % explorations.length; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = explorations.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return <div className="ai-explore">
    <div className="ai-explore-intro">
      <p>Illustrative comparisons show the tradeoffs behind the proposed direction.</p>
    </div>
    <div className="ai-explore-tabs" role="tablist" aria-label="Explore design tradeoffs">
      {explorations.map((exploration, index) => <button
        key={exploration.id}
        ref={element => { tabRefs.current[index] = element; }}
        type="button"
        role="tab"
        id={`${instanceId}-tab-${exploration.id}`}
        aria-controls={`${instanceId}-panel-${exploration.id}`}
        aria-selected={activeIndex === index}
        tabIndex={activeIndex === index ? 0 : -1}
        onClick={() => setActiveIndex(index)}
        onKeyDown={event => handleTabKeyDown(event, index)}
      >{exploration.label}</button>)}
    </div>
    {explorations.map((exploration, index) => <div
      key={exploration.id}
      id={`${instanceId}-panel-${exploration.id}`}
      role="tabpanel"
      aria-labelledby={`${instanceId}-tab-${exploration.id}`}
      tabIndex={0}
      hidden={activeIndex !== index}
      className="ai-explore-panel"
    >
      <div className="ai-explore-comparison">
        <figure className="ai-explore-card">
          <div className="ai-explore-card-header"><span>Alternative</span><h4>{exploration.alternative}</h4></div>
          <Wireframe id={exploration.id} proposed={false} />
          <figcaption>{exploration.alternativeCaption}</figcaption>
        </figure>
        <figure className="ai-explore-card ai-explore-card-proposed">
          <div className="ai-explore-card-header"><span>Proposed direction</span><h4>{exploration.direction}</h4></div>
          <Wireframe id={exploration.id} proposed />
          <figcaption>{exploration.directionCaption}</figcaption>
        </figure>
      </div>
      <p className="ai-explore-tradeoff"><span>Tradeoff</span>{exploration.tradeoff}</p>
    </div>)}
  </div>;
}
