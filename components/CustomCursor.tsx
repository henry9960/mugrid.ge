'use client';
import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target  = e.target as Element;
      const isHover = !!target.closest('a,button,[role="button"]');
      const rc      = isHover ? 'rgba(16,185,129,0.7)'  : 'rgba(10,10,10,0.6)';
      const rc2     = isHover ? 'rgba(16,185,129,0.3)'  : 'rgba(10,10,10,0.25)';
      const zoom    = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const x = e.clientX / zoom, y = e.clientY / zoom;

      for (let i = 0; i < 2; i++) {
        const r = document.createElement('div');
        r.className = 'cc-click-ripple';
        r.style.cssText = `left:${x}px;top:${y}px;--rc:${i === 0 ? rc : rc2};--rdur:${i === 0 ? '0.5s' : '0.7s'};animation-delay:${i === 0 ? '0s' : '0.07s'};`;
        document.body.appendChild(r);
        r.addEventListener('animationend', () => r.remove());
      }
    }

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  return null;
}
