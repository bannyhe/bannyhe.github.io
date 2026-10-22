import { localize } from "../../i18n/locale";
import { useState } from "react";
import { ProjectImageLightbox } from "../case-study/ProjectImageLightbox";
import { Expand } from "lucide-react";

const MEDIA_ROOT = "/media/ai-assistant/";

export function CaseStudyFigure({ name, alt, caption, version }: { name: string; alt: string; caption: string; version?: string }) {
  const [expanded, setExpanded] = useState(false);
  const src = `${MEDIA_ROOT}${name}.png${version ? `?v=${encodeURIComponent(version)}` : ""}`;

  return (
    <figure className="ai-figure">
      <button type="button" className="ai-media-button" onClick={() => setExpanded(true)} aria-haspopup="dialog" aria-label={localize(`Enlarge: ${alt}`)}>
        <img src={src} alt={localize(alt)} width={1600} height={1000} loading="lazy" decoding="async" />
      </button>
      <figcaption>{localize(caption)}</figcaption>
      <ProjectImageLightbox image={expanded ? { src, alt } : null} onClose={() => setExpanded(false)} />
    </figure>
  );
}

export function CaseStudyClip({ name, poster, title, caption, steps, version }: {
  name: string;
  poster: string;
  title: string;
  caption: string;
  steps: string[];
  version?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [width, height] = [1600, 1000];
  const revision = version ? `?v=${encodeURIComponent(version)}` : "";
  const posterSrc = `${MEDIA_ROOT}${poster}.png${revision}`;
  return (
    <figure className="ai-figure ai-clip">
      <div className="ai-media-stage">
        <video controls playsInline preload="metadata" poster={posterSrc} width={width} height={height} aria-label={localize(title)}>
          <source src={`${MEDIA_ROOT}${name}.mp4${revision}`} type="video/mp4" />{localize("Your browser does not support this video. The walkthrough steps below describe the interaction.")}</video>
      </div>
      <figcaption>{localize(caption)}</figcaption>
      <div className="ai-media-tools">
        <button type="button" className="ai-still-link" onClick={() => setExpanded(true)} aria-haspopup="dialog" aria-label={localize(`Open the full-size still frame for ${title}`)}>{localize("Open image to zoom ")}<Expand size={16} aria-hidden="true" />
        </button>
      </div>
      <ol className="ai-walkthrough-steps" aria-label={localize("Walkthrough steps")}>
        {localize(steps.map((step) => <li key={step}>{localize(step)}</li>))}
      </ol>
      <ProjectImageLightbox image={expanded ? { src: posterSrc, alt: `Still frame: ${title}` } : null} onClose={() => setExpanded(false)} />
    </figure>
  );
}
