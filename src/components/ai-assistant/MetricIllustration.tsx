import { Check, Clock3, Scan, History, ShieldCheck } from "lucide-react";

export type MetricKind = "diagnosis" | "selection" | "decision" | "continuity";

/** Small conceptual illustrations, with no implied scores or measured data. */
export function MetricIllustration({ kind }: { kind: MetricKind }) {
  return <svg className="ai-metric-illustration" viewBox="0 0 112 80" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="2" y="4" width="108" height="72" rx="16" fill="var(--ai-tint)" stroke="none" />
    {kind === "diagnosis" && <>
      <rect x="15" y="15" width="50" height="49" rx="6" fill="var(--ai-surface)" stroke="currentColor" strokeOpacity=".6" />
      <path d="M25 27h25M25 38h15M25 49h12" />
      <circle cx="76" cy="46" r="22" fill="var(--ai-media-surface)" stroke="currentColor" strokeOpacity=".6" />
      <Clock3 x="57" y="27" width="38" height="38" strokeWidth="1.7" />
    </>}
    {kind === "selection" && <>
      <path d="M34 24h17v31H34m17-15h18" stroke="currentColor" strokeOpacity=".6" />
      <rect x="13" y="15" width="26" height="18" rx="4" fill="var(--ai-surface)" stroke="currentColor" strokeOpacity=".6" />
      <rect x="13" y="47" width="26" height="18" rx="4" fill="var(--ai-surface)" stroke="currentColor" strokeOpacity=".6" />
      <path d="M20 24h12M20 56h12" stroke="currentColor" strokeOpacity=".6" />
      <rect x="69" y="29" width="25" height="22" rx="4" fill="var(--ai-surface)" stroke="none" />
      <Scan x="60" y="18" width="44" height="44" strokeWidth="1.5" />
      <Check x="73" y="31" width="17" height="17" strokeWidth="2" />
    </>}
    {kind === "decision" && <>
      <rect x="14" y="14" width="50" height="52" rx="6" fill="var(--ai-surface)" stroke="currentColor" strokeOpacity=".6" />
      <path d="m23 27 3 3 5-6m-8 18 3 3 5-6M37 27h16M37 42h12M23 55h24" />
      <circle cx="80" cy="46" r="22" fill="var(--ai-media-surface)" stroke="none" />
      <ShieldCheck x="60" y="24" width="41" height="43" strokeWidth="1.7" />
    </>}
    {kind === "continuity" && <>
      <path d="M21 15h51a6 6 0 0 1 6 6v27a6 6 0 0 1-6 6H34l-12 9v-9h-1a6 6 0 0 1-6-6V21a6 6 0 0 1 6-6Z" fill="var(--ai-surface)" stroke="currentColor" strokeOpacity=".6" />
      <path d="M26 28h36M26 40h22" />
      <circle cx="80" cy="52" r="22" fill="var(--ai-media-surface)" stroke="none" />
      <History x="61" y="33" width="38" height="38" strokeWidth="1.7" />
    </>}
  </svg>;
}
