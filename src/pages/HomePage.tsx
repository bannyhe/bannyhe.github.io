import { useState } from 'react';
import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import '../styles/home.css';

export function HomePage() {
  const [paused, setPaused] = useState(false);
  return (
    <main className="orbital-home" data-motion={paused ? 'paused' : 'playing'}>
      <Hero paused={paused} onToggleMotion={() => setPaused(value => !value)} />
      <Projects />
    </main>
  );
}
