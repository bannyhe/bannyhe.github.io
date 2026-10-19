import { useId, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import "../../styles/case-study.css";

type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  // Display only the original product artwork; the title is now responsive text.
  crop?: { x: number; y: number; width: number; height: number };
};

export function ProjectHero({ title, description, image, icon: Icon, tags = ["UX Research", "UX Design"], tone = "blue" }: {
  title: string;
  description: string;
  image: ProjectImage;
  icon: LucideIcon;
  tags?: string[];
  tone?: "blue" | "xenith";
}) {
  const titleId = useId();
  const crop = image.crop;
  const imageStyle: CSSProperties | undefined = crop ? {
    position: "absolute", maxWidth: "none",
    width: `${image.width / crop.width * 100}%`,
    height: `${image.height / crop.height * 100}%`,
    left: `${-crop.x / crop.width * 100}%`, top: `${-crop.y / crop.height * 100}%`,
  } : undefined;

  return <div className="container mx-auto px-4">
    <div className="max-w-6xl mx-auto py-12">
      <header className="project-hero" data-tone={tone} aria-labelledby={titleId}>
        <div className="project-hero-copy">
          <h1 id={titleId} tabIndex={-1}><Icon aria-hidden="true" strokeWidth={1.5} /><span>{title}</span></h1>
          <p className="project-hero-description">{description}</p>
          <ul className="project-hero-tags" aria-label="Design disciplines">
            {tags.map(tag => <li key={tag}>/ {tag}</li>)}
          </ul>
        </div>
        <div className="project-hero-visual">
          <div className="project-hero-art" style={{ aspectRatio: crop ? `${crop.width} / ${crop.height}` : `${image.width} / ${image.height}` }}>
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} style={imageStyle} fetchPriority="high" />
          </div>
        </div>
      </header>
    </div>
  </div>;
}
