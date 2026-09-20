'use client';
import { useEffect, useRef } from 'react';
export default function GoldField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!,
      ctx = c.getContext('2d')!;
    let w = 0,
      h = 0,
      frame = 0;
    const mouse = { x: -999, y: -999 },
      reduce = matchMedia('(prefers-reduced-motion: reduce)');
    function resize() {
      const box = c.getBoundingClientRect();
      w = box.width;
      h = box.height;
      const d = Math.min(devicePixelRatio, 2);
      c.width = w * d;
      c.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(c);
    const pointer = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const leave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };
    const host = c.parentElement!;
    host.addEventListener('pointermove', pointer);
    host.addEventListener('pointerleave', leave);
    function draw(t: number) {
      if (!document.hidden) {
        ctx.clearRect(0, 0, w, h);
        const time = reduce.matches ? 0 : t * 0.00045;
        for (let y = 8; y < h; y += 12)
          for (let x = 8; x < w; x += 12) {
            const dx = x - mouse.x,
              dy = y - mouse.y,
              d = Math.hypot(dx, dy),
              touch = reduce.matches ? 0 : Math.max(0, 1 - d / 180),
              wave =
                Math.sin(x * 0.018 + time) * Math.cos(y * 0.012 - time * 0.7),
              pulse = (Math.sin(x * 17 + y * 11 + time * 2) + 1) / 2,
              ridge = (Math.sin(x * 0.009 + y * 0.008 + time * 0.5) + 1) / 2;
            ctx.fillStyle = `rgba(233,190,94,${0.025 + ridge * 0.16 + pulse * 0.09 + touch * 0.65})`;
            ctx.beginPath();
            ctx.arc(
              x + (d ? (dx / d) * touch * 14 : 0),
              y + wave * 3 + (d ? (dy / d) * touch * 14 : 0),
              0.6 + pulse * 0.35 + touch * 1.3,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
      }
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener('pointermove', pointer);
      host.removeEventListener('pointerleave', leave);
    };
  }, []);
  return <canvas className="gold-field" ref={ref} aria-hidden="true" />;
}
