import { useRef, type RefObject } from "react";
import { Expand, X } from "lucide-react";

const MEDIA_ROOT = "/media/ai-assistant/";

function ImageLightbox({ dialogRef, src, alt }: { dialogRef: RefObject<HTMLDialogElement>; src: string; alt: string }) {
  return (
    <dialog ref={dialogRef} className="ai-lightbox" aria-label={alt} onClick={(event) => {
      if (event.target === event.currentTarget) dialogRef.current?.close();
    }}>
      <button type="button" className="ai-lightbox-close" aria-label="Close enlarged image" onClick={() => dialogRef.current?.close()} autoFocus>
        <X size={32} aria-hidden="true" />
      </button>
      <img src={src} alt={alt} loading="lazy" />
    </dialog>
  );
}

export function CaseStudyFigure({ name, alt, caption, version }: { name: string; alt: string; caption: string; version?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const src = `${MEDIA_ROOT}${name}.png${version ? `?v=${encodeURIComponent(version)}` : ""}`;

  return (
    <figure className="ai-figure">
      <button type="button" className="ai-media-button" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog" aria-label={`Enlarge: ${alt}`}>
        <img src={src} alt={alt} width={1600} height={1000} loading="lazy" decoding="async" />
      </button>
      <figcaption>{caption}</figcaption>
      <ImageLightbox dialogRef={dialog} src={src} alt={alt} />
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
  const dialog = useRef<HTMLDialogElement>(null);
  const [width, height] = [1600, 1000];
  const revision = version ? `?v=${encodeURIComponent(version)}` : "";
  const posterSrc = `${MEDIA_ROOT}${poster}.png${revision}`;
  return (
    <figure className="ai-figure ai-clip">
      <div className="ai-media-stage">
        <video controls playsInline preload="metadata" poster={posterSrc} width={width} height={height} aria-label={title}>
          <source src={`${MEDIA_ROOT}${name}.mp4${revision}`} type="video/mp4" />
          Your browser does not support this video. The walkthrough steps below describe the interaction.
        </video>
      </div>
      <figcaption>{caption}</figcaption>
      <div className="ai-media-tools">
        <button type="button" className="ai-still-link" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog" aria-label={`Open the full-size still frame for ${title}`}>
          Open image to zoom <Expand size={16} aria-hidden="true" />
        </button>
      </div>
      <ol className="ai-walkthrough-steps" aria-label="Walkthrough steps">
        {steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
      <ImageLightbox dialogRef={dialog} src={posterSrc} alt={`Still frame: ${title}`} />
    </figure>
  );
}
