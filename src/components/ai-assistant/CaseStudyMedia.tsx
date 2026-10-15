import { useRef } from "react";
import { Expand, X } from "lucide-react";

const MEDIA_ROOT = "/media/ai-assistant/";

export function CaseStudyFigure({ name, alt, caption }: { name: string; alt: string; caption: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const src = `${MEDIA_ROOT}${name}.png`;

  return (
    <figure className="ai-figure">
      <button type="button" className="ai-media-button" onClick={() => dialog.current?.showModal()} aria-label={`Enlarge: ${alt}`}>
        <img src={src} alt={alt} width={1600} height={1000} loading="lazy" decoding="async" />
        <span className="ai-enlarge"><Expand size={15} aria-hidden="true" /> Enlarge</span>
      </button>
      <figcaption>{caption}</figcaption>
      <dialog ref={dialog} className="ai-lightbox" aria-label={alt} onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}>
        <button type="button" className="ai-lightbox-close" aria-label="Close enlarged image" onClick={() => dialog.current?.close()} autoFocus>
          <X size={24} aria-hidden="true" />
        </button>
        <img src={src} alt={alt} loading="lazy" />
      </dialog>
    </figure>
  );
}

export function CaseStudyClip({ name, poster, title, caption, steps }: {
  name: string;
  poster: string;
  title: string;
  caption: string;
  steps: string[];
}) {
  const [width, height] = name === "object-context-walkthrough" ? [1340, 330] : name === "session-continuity-walkthrough" ? [850, 470] : [1360, 850];
  return (
    <figure className={`ai-figure ai-clip${width === 850 ? " ai-clip-compact" : ""}`}>
      <video controls playsInline preload="none" poster={`${MEDIA_ROOT}${poster}.png`} width={width} height={height} aria-label={title}>
        <source src={`${MEDIA_ROOT}${name}.mp4`} type="video/mp4" />
        Your browser does not support this video. The walkthrough steps below describe the interaction.
      </video>
      <figcaption>{caption}</figcaption>
      <a className="ai-still-link" href={`${MEDIA_ROOT}${poster}.png`} target="_blank" rel="noopener noreferrer" aria-label={`Open the full-size still frame for ${title} in a new tab`}>
        View full-size still <span aria-hidden="true">↗</span>
      </a>
      <details className="ai-transcript">
        <summary>Read the walkthrough steps</summary>
        <ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol>
      </details>
    </figure>
  );
}
