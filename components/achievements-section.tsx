'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  { end: 15, suffix: 'K', label: 'Sales' },
  { end: 20, suffix: 'K', label: 'Servers using Flake Scripts*' },
  { end: 65, suffix: 'K', label: 'Players enjoying Flake Scripts*' },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    start.current = null;

    function step(ts: number) {
      if (start.current === null) start.current = ts;
      const elapsed = ts - start.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    }

    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [active, target, duration]);

  return value;
}

function StatItem({ stat, active }: { stat: typeof STATS[0]; active: boolean }) {
  const value = useCountUp(stat.end, 1000, active);
  return (
    <div className="w-full text-center leading-none">
      <div
        className="font-black text-[80px] leading-[67.5px] xl:leading-[100px] xl:text-[120px] bg-gradient-to-br from-blue-400 to-blue-700 inline-block text-transparent bg-clip-text"
        style={{ textShadow: '0 0 100px rgba(59,130,246,0.3)' }}
      >
        <span>{value}</span>
        <span className="text-[60px] xl:text-[80px]">{stat.suffix}</span>
      </div>
      <p className="font-medium text-neutral-500 text-base xl:text-lg mt-4 xl:mt-8">{stat.label}</p>
    </div>
  );
}

export function AchievementsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-2">
      {STATS.map(stat => (
        <StatItem key={stat.label} stat={stat} active={active} />
      ))}
    </div>
  );
}
