import { useEffect, useRef, useState } from 'react';
import { motion, useInView, type MotionValue } from 'motion/react';

export function GalaxyAtmosphere({ x, rotate, enabled, reduced }: {
  x: MotionValue<string>;
  rotate: MotionValue<number>;
  enabled: boolean;
  reduced: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const inView = useInView(host);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return (
    <div ref={host} className="galaxy-atmosphere" aria-hidden="true"
      data-motion={reduced ? 'reduced' : enabled && inView && pageVisible ? 'playing' : 'paused'}>
      <motion.div className="galaxy-nebula" style={reduced ? undefined : { x, rotate }}>
        <div className="galaxy-reflection" />
        <div className="galaxy-reflection galaxy-reflection-secondary" />
      </motion.div>
      <div className="galaxy-horizon" />
    </div>
  );
}
