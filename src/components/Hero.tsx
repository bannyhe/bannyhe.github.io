import { localize } from "../i18n/locale";
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { GalaxyScene } from './home/GalaxyScene';

const chapters = [
  { label: 'Overview', at: 0 },
  { label: 'AI', at: .30, eyebrow: '01 / Artificial intelligence', title: <>{localize("AI that works")}<br/>{localize("with you.")}</>, description: 'Turning complex investigations into clear, contextual conversations.', project: 'ai-assistant', link: 'Explore Network AI Assistant' },
  { label: 'Networks', at: .64, eyebrow: '02 / Connected systems', title: <>{localize("See the whole")}<br/>{localize("network.")}</>, description: 'Making connections visible, so operators can find the signal and act with confidence.', project: 'vcf-network', link: 'Explore Network Operations' },
  { label: 'Security', at: 1, eyebrow: '03 / Security & trust', title: <>{localize("Clarity when")}<br/>{localize("it matters.")}</>, description: 'Helping people understand threats, prioritize risk, and protect what matters.', project: 'malware-prevention', link: 'Explore Malware Prevention' },
];
export function Hero({ paused, onToggleMotion }: { paused: boolean; onToggleMotion: () => void }) {
  const section=useRef<HTMLElement>(null);
  const reduced=usePrefersReducedMotion();
  const [chapter,setChapter]=useState(0);
  const enabled=!paused&&!reduced;
  const {scrollYProgress}=useScroll({target:section,offset:['start start','end end']});
  useMotionValueEvent(scrollYProgress,'change',p=>setChapter(p<.16?0:p<.48?1:p<.8?2:3));
  const phaseWidth=useTransform(scrollYProgress,[0,1],['3%','100%']);
  const glowX=useTransform(scrollYProgress,[0,.35,.65,1],['0%','-3%','3%','0%']);
  const glowRotate=useTransform(scrollYProgress,[0,1],[-12,4]);
  const active=reduced?0:chapter;
  const explore=()=>{
    const projects=document.getElementById('projects');projects?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});projects?.focus({preventScroll:true});
  };
  const seek=(index:number)=>{
    if(!section.current)return;
    const top=window.scrollY+section.current.getBoundingClientRect().top;
    const distance=section.current.offsetHeight-(section.current.querySelector('.galaxy-stage') as HTMLElement).offsetHeight;
    window.scrollTo({top:top+distance*chapters[index].at,behavior:reduced?'auto':'smooth'});
  };
  return <section ref={section} className={`galaxy-hero${reduced?' galaxy-hero-static':''}`} aria-labelledby="home-heading" data-chapter={active}>
    <div className="galaxy-stage">
      <div className="galaxy-atmosphere" aria-hidden="true"><motion.div className="galaxy-nebula" style={reduced?undefined:{x:glowX,rotate:glowRotate}}/><div className="galaxy-horizon"/></div>
      <GalaxyScene progress={scrollYProgress} enabled={enabled} reduced={reduced}/>
      <div className="galaxy-editorial">
        <div className="galaxy-copy-stack">
          <div className="galaxy-copy galaxy-introduction" data-active={active===0} {...(active!==0?{inert: ''}:{})} aria-hidden={active!==0}>
            <p className="home-eyebrow"><span className="home-status-dot"/>{localize("Mu He · Product designer")}</p>
            <h1 id="home-heading">{localize("Complexity,")}<br/>{localize("made clear.")}</h1>
            <p className="home-intro">{localize("I design intuitive experiences for the people behind complex systems.")}</p>
            <p className="home-experience">{localize("7+ years in B2B · AI, cloud & enterprise")}</p>
            <div className="home-actions"><button type="button" className="home-primary-action" onClick={explore}>{localize("Explore my work")}<ArrowDown size={16} aria-hidden="true"/></button><Link className="home-secondary-action" to="/about">{localize("Meet Mu")}<ArrowUpRight size={16} aria-hidden="true"/></Link></div>
          </div>
          {localize(chapters.slice(1).map((item,i)=><div key={item.project} className="galaxy-copy galaxy-chapter-copy" data-active={active===i+1} {...(active!==i+1?{inert: ''}:{})} aria-hidden={active!==i+1}>
            <p className="home-eyebrow">{localize(item.eyebrow)}</p><h2>{localize(item.title)}</h2><p className="home-intro">{localize(item.description)}</p>
            <Link className="home-secondary-action galaxy-case-link" to={`/project/${item.project}`}>{localize(item.link)}<ArrowUpRight size={16} aria-hidden="true"/></Link>
            <button type="button" className="galaxy-all-work" onClick={explore}>{localize("View all projects")}<ArrowDown size={12} aria-hidden="true"/></button>
          </div>))}
        </div>
      </div>
      <p className="galaxy-coordinate" aria-hidden="true">{localize("Three domains.")}<br/><span>{localize("One connected practice.")}</span></p>
      <div className="galaxy-footer">
        <div className="galaxy-journey-controls">
          <p className="galaxy-scroll-hint"><ArrowDown size={13} aria-hidden="true"/>{localize(reduced?'Explore the case studies below':'Scroll to follow the connections')}</p>
          {localize(!reduced&&<nav className="galaxy-chapters" aria-label={localize("Explore design domains")}>{localize(chapters.map((item,i)=><button key={item.label} type="button" aria-current={active===i?'step':undefined} onClick={()=>seek(i)}><span className="galaxy-chapter-dot"/>{localize(item.label)}</button>))}</nav>)}
        </div>
        <button type="button" className="home-motion-toggle" onClick={onToggleMotion} aria-pressed={paused||reduced} disabled={reduced}>{localize(enabled?<Pause size={12} aria-hidden="true"/>:<Play size={12} aria-hidden="true"/>)}{localize(reduced?'Reduced motion':paused?'Resume ambience':'Pause ambience')}</button>
      </div>
      <div className="home-scroll-progress" aria-hidden="true"><motion.span style={{width:reduced?'100%':phaseWidth}}/></div>
    </div>
  </section>;
}
