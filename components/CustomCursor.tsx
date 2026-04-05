'use client';
import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    const GOLD    = ['#FFD700','#FFC107','#F472B6','#A78BFA','#60A5FA','#34D399','#FB923C','#ffffff','#FDE68A','#C4B5FD'];
    const EMERALD = ['#10b981','#34d399','#22d3ee','#a78bfa','#ffffff','#6ee7b7','#38bdf8','#86efac'];

    function spawnStar(ox: number, oy: number, colors: string[]) {
      const el    = document.createElement('div');
      el.className = 'cc-star';
      const size  = 5 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      const dist  = 18 + Math.random() * 30;
      const tx    = Math.cos(angle) * dist;
      const ty    = Math.sin(angle) * dist;
      const dur   = 480 + Math.random() * 380;
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.cssText = `left:${ox}px;top:${oy}px;width:${size}px;height:${size}px;color:${color};` +
        `--dur:${dur}ms;--tx:${tx}px;--ty:${ty}px;` +
        `--tx20:${tx * 0.25}px;--ty20:${ty * 0.25}px;--tx70:${tx * 0.78}px;--ty70:${ty * 0.78}px;`;
      el.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor">` +
        `<path d="M12 1 L13.8 9.8 L22.5 12 L13.8 14.2 L12 23 L10.2 14.2 L1.5 12 L10.2 9.8 Z"/></svg>`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), dur + 50);
    }

    function onClick(e: MouseEvent) {
      const target   = e.target as Element;
      const isHover  = !!target.closest('a,button,[role="button"]');
      const colors   = isHover ? EMERALD : GOLD;
      const rc       = isHover ? 'rgba(16,185,129,0.7)'  : 'rgba(10,10,10,0.6)';
      const rc2      = isHover ? 'rgba(16,185,129,0.3)'  : 'rgba(10,10,10,0.25)';
      // Account for CSS zoom on <html> — clientX/clientY are in visual pixels in some browsers
      const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const x = e.clientX / zoom, y = e.clientY / zoom;

      for (let i = 0; i < 10; i++) setTimeout(() => spawnStar(x, y, colors), i * 28);
      setTimeout(() => { spawnStar(x, y, colors); spawnStar(x, y, colors); spawnStar(x, y, colors); }, 150);

      for (let i = 0; i < 2; i++) {
        const r = document.createElement('div');
        r.className = 'cc-click-ripple';
        r.style.cssText = `left:${x}px;top:${y}px;--rc:${i === 0 ? rc : rc2};--rdur:${i === 0 ? '0.5s' : '0.7s'};animation-delay:${i === 0 ? '0s' : '0.07s'};`;
        document.body.appendChild(r);
        r.addEventListener('animationend', () => r.remove());
      }
    }

    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
