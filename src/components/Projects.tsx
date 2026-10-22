import { localize } from "../i18n/locale";
import type { CSSProperties } from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAnalytics } from '../hooks/useAnalytics';
import assistantThumbnailImg from '../assets/ai-assistant/assistant-main-thumbnail.svg';

const projects = [
  {
    id: 'malware-prevention', title: 'Malware Prevention Dashboard', category: 'Security · Data visualization',
    description: 'Making complex threat signals easier to understand and act on.',
    image: '/media/home/malware-prevention.png', crop: true, protected: false,
    accent: '#89a9c6',
  },
  {
    id: 'ai-assistant', title: 'Network AI Assistant', category: 'Conversational AI · Product vision',
    description: 'Bringing context, evidence, and next steps into one conversation.',
    image: assistantThumbnailImg, crop: false, protected: true, accent: '#9a9fc7',
  },
  {
    id: 'northstar-onboarding', title: 'Northstar Onboarding', category: 'Cloud · First-use experience',
    description: 'Turning a complex setup into a clear path forward.',
    image: '/media/home/northstar-onboarding.png', crop: false, protected: false,
    accent: '#87b5b4',
  },
  {
    id: 'vcf-network', title: 'VCF Network Operations', category: 'Infrastructure · Systems thinking',
    description: 'Helping operators see connections across their network.',
    image: '/media/home/vcf-network.png', crop: false, protected: true,
    accent: '#8bafcd',
  },
  {
    id: 'xenith-website', title: 'Xenith Website Redesign', category: 'Commerce · Digital experience',
    description: 'A clearer way to discover, compare, and choose the right equipment.',
    image: '/media/home/xenith-website.jpg', crop: false, protected: false,
    accent: '#c2a18b',
  },
];

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const { trackEvent } = useAnalytics();
  return (
    <article className="home-project">
      <Link to={`/project/${project.id}`} className="home-project-link" onClick={() => trackEvent('project_view', project.id)} aria-labelledby={`project-title-${project.id}`} style={{ '--project-accent': project.accent } as CSSProperties}>
        <div className="home-project-image">
          <ImageWithFallback
            src={project.image} alt={localize(`${project.title} project preview`)} loading="lazy" decoding="async" width={800} height={600}
            className={project.crop ? 'home-project-thumbnail home-project-thumbnail-crop' : 'home-project-thumbnail'}
          />
          {localize(project.protected && <span className="home-project-lock"><Lock size={12} aria-hidden="true" />{localize("Protected")}</span>)}
          <span className="home-project-open" aria-hidden="true"><ArrowUpRight size={22} /></span>
        </div>
        <div className="home-project-details">
          <div className="home-project-topline"><span>{localize(project.category)}</span><span className="home-project-number">0{localize(index + 1)}</span></div>
          <h3 id={`project-title-${project.id}`}>{localize(project.title)}</h3>
          <p>{localize(project.description)}</p>
          <span className="home-project-read">{localize("Explore case study ")}<ArrowUpRight size={14} aria-hidden="true" /></span>
        </div>
      </Link>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="home-projects" tabIndex={-1} aria-labelledby="selected-work-heading">
      <div className="home-work-heading">
        <div><p className="home-eyebrow">{localize("Selected work / 01—05")}</p><h2 id="selected-work-heading">{localize("Different challenges.")}<br /><span>{localize("The same care.")}</span></h2></div>
        <p>{localize("A closer look at how I bring clarity to complex products, from the first question to the final interaction.")}</p>
      </div>
      <div className="home-project-grid">
        {localize(projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />))}
        <aside className="home-contact-card" aria-labelledby="home-contact-heading">
          <span className="home-contact-orb" aria-hidden="true" />
          <p className="home-eyebrow">{localize("The next chapter")}</p>
          <h3 id="home-contact-heading">{localize("Have something")}<br />{localize("in mind?")}</h3>
          <p>{localize("Let’s make it feel simple.")}</p>
          <a className="home-secondary-action" href="mailto:bannyhe@umich.edu">{localize("Start a conversation ")}<ArrowUpRight size={17} aria-hidden="true" /></a>
        </aside>
      </div>
    </section>
  );
}
