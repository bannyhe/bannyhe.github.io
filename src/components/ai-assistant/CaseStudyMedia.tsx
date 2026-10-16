import { useRef } from "react";
import { Expand, X } from "lucide-react";

const MEDIA_ROOT = "/media/ai-assistant/";

export function CaseStudyFigure({ name, alt, caption, version }: { name: string; alt: string; caption: string; version?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const src = `${MEDIA_ROOT}${name}.png${version ? `?v=${encodeURIComponent(version)}` : ""}`;

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

export function CaseStudyClip({ name, poster, title, caption, steps, version }: {
  name: string;
  poster: string;
  title: string;
  caption: string;
  steps: string[];
  version?: string;
}) {
  const [width, height] = [1600, 1000];
  const revision = version ? `?v=${encodeURIComponent(version)}` : "";
  const posterSrc = `${MEDIA_ROOT}${poster}.png${revision}`;
  return (
    <figure className="ai-figure ai-clip">
      <div className="ai-media-stage">
        <video controls playsInline preload="none" poster={posterSrc} width={width} height={height} aria-label={title}>
          <source src={`${MEDIA_ROOT}${name}.mp4${revision}`} type="video/mp4" />
          Your browser does not support this video. The walkthrough steps below describe the interaction.
        </video>
      </div>
      <figcaption>{caption}</figcaption>
      <div className="ai-media-tools">
        <a className="ai-still-link" href={posterSrc} target="_blank" rel="noopener noreferrer" aria-label={`Open the full-size still frame for ${title} in a new tab`}>
          Open image to zoom <span aria-hidden="true">↗</span>
        </a>
      </div>
      <ol className="ai-walkthrough-steps" aria-label="Walkthrough steps">
        {steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
    </figure>
  );
}
