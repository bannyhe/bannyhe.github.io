import { useEffect, useRef, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import "../../styles/case-study.css";

type ExpandedImage = { src: string; alt: string; clipPath?: string; cropped?: boolean };

export function activateImageOnKey(event: KeyboardEvent<HTMLElement>) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.currentTarget.click();
  }
}

export function ProjectImageLightbox({ image, onClose }: { image: ExpandedImage | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;

  useEffect(() => {
    const element = dialog.current;
    if (!image || !element) return;
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    const closed = () => { if (!element.open) closeCallback.current(); };
    element.addEventListener("close", closed);
    document.body.style.overflow = "hidden";
    element.showModal();
    return () => {
      element.removeEventListener("close", closed);
      element.close();
      document.body.style.overflow = overflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [image?.src, image?.alt]);

  if (!image) return null;
  return <dialog ref={dialog} className="project-lightbox" aria-label={image.alt} onClick={event => {
    if (event.target === event.currentTarget) dialog.current?.close();
  }}>
    <button type="button" className="project-lightbox-close" aria-label="Close enlarged image" onClick={() => dialog.current?.close()} autoFocus><X size={32} aria-hidden="true" /></button>
    <div className="project-lightbox-frame" style={image.cropped ? { overflow: "hidden" } : undefined}>
      <img src={image.src} alt={image.alt} style={{ clipPath: image.clipPath, transform: image.cropped ? "scale(1.0204)" : undefined }} />
    </div>
  </dialog>;
}
