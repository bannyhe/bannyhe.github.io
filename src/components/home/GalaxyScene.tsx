import { localize } from "../../i18n/locale";
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Cpu, Network, ShieldCheck } from 'lucide-react';
import type { MotionValue } from 'motion/react';
import type { CSSProperties } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import { galaxyLayout, journeyPoint } from './galaxyLayout';

const destinations = [
  { name: 'AI', description: 'Intelligent experiences', project: 'ai-assistant', Icon: Cpu },
  { name: 'Network', description: 'Connected systems', project: 'vcf-network', Icon: Network },
  { name: 'Security', description: 'Confidence & trust', project: 'malware-prevention', Icon: ShieldCheck },
];

export function GalaxyScene({ progress, enabled, reduced }: { progress: MotionValue<number>; enabled: boolean; reduced: boolean }) {
  const { theme } = useTheme();
  const { trackEvent } = useAnalytics();
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const marker = useRef<SVGCircleElement>(null);
  const trail = useRef<SVGLineElement>(null);
  const options = useRef({ enabled, reduced, dark: theme === 'dark' });
  const wake = useRef(() => {});
  const [ready, setReady] = useState(false);
  const [layout, setLayout] = useState(() => galaxyLayout(1440, 900, false));

  useEffect(() => {
    options.current = { enabled, reduced, dark: theme === 'dark' };
    wake.current();
  }, [enabled, reduced, theme]);

  useEffect(() => {
    const element = host.current, surface = canvas.current;
    if (!element || !surface) return;
    let renderer: ReturnType<typeof import('./galaxyRenderer').createGalaxyRenderer> | undefined;
    let disposed = false, visible = true, lost = false, frame = 0;
    let previous = performance.now(), time = 0;
    let currentLayout = galaxyLayout(element.clientWidth, element.clientHeight, window.matchMedia('(max-width: 767px)').matches);
    const pointer = { x: 0, y: 0 }, target = { x: 0, y: 0 };

    const request = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const draw = (now: number) => {
      frame = 0;
      const { enabled, reduced, dark } = options.current;
      if (enabled) {
        const delta = Math.max(0, Math.min(now - previous, 100)) / 1000;
        time += delta;
        const follow = 1 - Math.exp(-4.2 * delta);
        pointer.x += (target.x - pointer.x) * follow;
        pointer.y += (target.y - pointer.y) * follow;
      }
      if (reduced) { time = 0; pointer.x = pointer.y = 0; }
      previous = now;
      const phase = reduced ? 0 : Math.max(0, Math.min(1, progress.get()));
      const active = phase < .16 ? -1 : phase < .48 ? 0 : phase < .8 ? 1 : 2;
      if (!lost) renderer?.draw(phase, time, dark, pointer, reduced ? -1 : active);
      const point = journeyPoint(currentLayout, phase);
      marker.current?.setAttribute('cx', String(point.x));
      marker.current?.setAttribute('cy', String(point.y));
      trail.current?.setAttribute('x2', String(point.x));
      trail.current?.setAttribute('y2', String(point.y));
      links.current.forEach((link, index) => {
        if (!link) return;
        link.dataset.active = String(active === index);
        if (active === index) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
      element.dataset.phase = phase.toFixed(3);
      if (enabled && renderer && !lost) request();
    };
    const resize = () => {
      currentLayout = galaxyLayout(element.clientWidth, element.clientHeight, window.matchMedia('(max-width: 767px)').matches);
      setLayout(currentLayout);
      renderer?.resize(element.clientWidth, element.clientHeight);
      request();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { previous = performance.now(); request(); }
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    visibility.observe(element);
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else { previous = performance.now(); request(); }
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !options.current.enabled) return;
      const bounds = element.getBoundingClientRect();
      target.x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
      target.y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
      request();
    };
    const onLeave = () => { target.x = target.y = 0; request(); };
    const onLost = (event: Event) => {
      event.preventDefault(); lost = true;
      setReady(false); request();
    };
    // Three.js restores its GL resources before the next scheduled redraw.
    const onRestore = () => { lost = false; setReady(true); resize(); };
    const unsubscribe = progress.on('change', request);
    document.addEventListener('visibilitychange', onVisibility);
    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', onLeave);
    surface.addEventListener('webglcontextlost', onLost);
    surface.addEventListener('webglcontextrestored', onRestore);
    wake.current = () => { previous = performance.now(); request(); };
    resize();
    import('./galaxyRenderer').then(({ createGalaxyRenderer }) => {
      if (disposed) return;
      try { renderer = createGalaxyRenderer(surface); setReady(true); resize(); }
      catch { setReady(false); }
    }).catch(() => { if (!disposed) setReady(false); });
    return () => {
      disposed = true; wake.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect(); visibility.disconnect(); unsubscribe();
      document.removeEventListener('visibilitychange', onVisibility);
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
      surface.removeEventListener('webglcontextlost', onLost);
      surface.removeEventListener('webglcontextrestored', onRestore);
      renderer?.dispose();
    };
  }, [progress]);

  return (
    <div className="galaxy-scene" ref={host} data-renderer={ready ? 'webgl' : 'fallback'}>
      <svg className="galaxy-route" viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
        <line className="galaxy-route-base" x1={layout.start.x} y1={layout.start.y} x2={layout.end.x} y2={layout.end.y} />
        <line ref={trail} className="galaxy-route-trail" x1={layout.start.x} y1={layout.start.y} x2={layout.start.x} y2={layout.start.y} />
        <circle ref={marker} className="galaxy-traveler" cx={layout.start.x} cy={layout.start.y} r="3" />
      </svg>
      <canvas ref={canvas} className="galaxy-canvas" aria-hidden="true" />
      {localize(destinations.map(({ name, description, project, Icon }, index) => (
        <Link
          key={project}
          ref={node => { links.current[index] = node; }}
          className={`galaxy-object galaxy-object-${index}`}
          style={{ left: layout.stops[index].x, top: layout.stops[index].y, width: layout.radius * 2, height: layout.radius * 2, '--stop-radius': `${layout.radius}px` } as CSSProperties}
          to={`/project/${project}`}
          aria-label={localize(`Explore ${name}: ${description}`)}
          onClick={() => trackEvent('project_view', project)}
        >
          <Icon className="galaxy-fallback-icon" aria-hidden="true" strokeWidth={1.25} />
          <span className="galaxy-object-label">
            <span className="galaxy-stop-index">0{localize(index + 1)}</span>
            <span className="galaxy-stop-title">{localize(name)}<ArrowUpRight size={13} aria-hidden="true" /></span>
            <span className="galaxy-stop-description">{localize(description)}</span>
          </span>
        </Link>
      )))}
    </div>
  );
}
