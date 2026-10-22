import { localize } from "../../i18n/locale";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import "../../styles/case-study.css";

type Section = { id: string; label: string };

/** Shared contents disclosure, section tracking, and back-to-top behavior. */
export function ProjectNavigation({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [showTop, setShowTop] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const reduced = usePrefersReducedMotion();
  const sectionIds = sections.map(section => section.id).join("|");

  useEffect(() => {
    const elements = sectionIds.split("|").map(id => document.getElementById(id)).filter((element): element is HTMLElement => !!element);
    let frame = 0;
    const update = () => {
      frame = 0;
      setShowTop(window.scrollY > 300);
      let current = "";
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= 132) current = element.id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sectionIds]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function close() {
    setOpen(false);
    toggle.current?.focus({ preventScroll: true });
  }

  function goToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(false);
    // Inline menus change page height. Measure the destination after closing.
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (!element) return;
      if (!element.hasAttribute("tabindex")) element.tabIndex = -1;
      element.focus({ preventScroll: true });
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 120, behavior: reduced ? "auto" : "smooth" });
    });
  }

  return <>
    <nav ref={nav} className="project-contents" aria-label={localize("Project contents")}
      onKeyDown={event => { if (event.key === "Escape" && open) { event.preventDefault(); close(); } }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button ref={toggle} type="button" className="project-contents-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(value => !value)}>{localize("Contents ")}<ChevronDown size={18} aria-hidden="true" />
      </button>
      {localize(open && <div id={panelId} className="project-contents-panel">
        <div className="project-contents-heading"><span>{localize("On this page")}</span><button type="button" aria-label={localize("Close contents")} onClick={close}><X size={20} aria-hidden="true" /></button></div>
        <ul>{localize(sections.map(section => <li key={section.id}>
          <a href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined} onClick={event => goToSection(event, section.id)}>{localize(section.label)}</a>
        </li>))}</ul>
      </div>)}
    </nav>
    {localize(showTop && <button type="button" className="project-back-to-top" aria-label={localize("Back to top")} onClick={() => {
      setOpen(false);
      document.querySelector<HTMLElement>(".project-hero h1")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    }}><ChevronUp size={24} aria-hidden="true" /></button>)}
  </>;
}
