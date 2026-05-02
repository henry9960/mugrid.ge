'use client';
import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target  = e.target as Element;
      const isHover = !!target.closest('a,button,[role="button"]');
      const base    = isHover ? '16,185,129' : '10,10,10';
      const zoom    = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const x = e.clientX / zoom, y = e.clientY / zoom;

      const rings = [
        { size: '50px',  dur: '0.5s',  delay: '0s',    opacity: 0.65 },
        { size: '100px', dur: '0.75s', delay: '0.08s', opacity: 0.4  },
        { size: '170px', dur: '1.0s',  delay: '0.2s',  opacity: 0.25 },
        { size: '250px', dur: '1.3s',  delay: '0.38s', opacity: 0.14 },
        { size: '340px', dur: '1.7s',  delay: '0.6s',  opacity: 0.07 },
      ];

      for (const ring of rings) {
        const r = document.createElement('div');
        r.className = 'cc-click-ripple';
        r.style.cssText = `left:${x}px;top:${y}px;--rc:rgba(${base},${ring.opacity});--rdur:${ring.dur};--rsize:${ring.size};--rop:${ring.opacity};animation-delay:${ring.delay};`;
        document.body.appendChild(r);
        r.addEventListener('animationend', () => r.remove());
      }
    }

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  return null;
}
