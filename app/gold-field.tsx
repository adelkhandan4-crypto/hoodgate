'use client';
import { useEffect, useRef } from 'react';
export default function GoldField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!,
      ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const mouse = { x: -999, y: -999 };
    let width = 0,
      height = 0,
      frame = 0,
      last = 0;
    function paint(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const t = reduce.matches ? 0 : time * 0.0004;
      for (let y = 8; y < height; y += 18)
        for (let x = 8; x < width; x += 18) {
          const dx = x - mouse.x,
            dy = y - mouse.y,
            distance = Math.hypot(dx, dy);
          const touch = reduce.matches ? 0 : Math.max(0, 1 - distance / 160);
          const pulse = (Math.sin(x * 0.08 + y * 0.055 + t * 2) + 1) / 2;
          const ridge = (Math.sin(x * 0.011 - y * 0.006 + t) + 1) / 2;
          const shift = touch * touch * 12;
          const px = x + (distance ? (dx / distance) * shift : 0);
          const py =
            y +
            Math.sin(x * 0.016 + t) * 2 +
            (distance ? (dy / distance) * shift : 0);
          const size = 0.7 + pulse * 0.3 + touch * 3.8;
          ctx.fillStyle = `rgba(233,190,94,${0.025 + ridge * 0.085 + pulse * 0.06 + touch * 0.34})`;
          ctx.beginPath();
          ctx.roundRect(
            px - size,
            py - size,
            size * 2,
            size * 2,
            Math.max(0.5, size * 0.3),
          );
          ctx.fill();
        }
    }
    function animate(time: number) {
      frame = 0;
      if (document.hidden || reduce.matches) return;
      if (time - last > 1000 / 30) {
        paint(time);
        last = time;
      }
      frame = requestAnimationFrame(animate);
    }
    function resume() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (document.hidden) return;
      paint(performance.now());
      if (!reduce.matches) frame = requestAnimationFrame(animate);
    }
    function resize() {
      const box = canvas.getBoundingClientRect(),
        dpr = Math.min(devicePixelRatio, 1.5);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      resume();
    }
    const pointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || reduce.matches) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const leave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('pointermove', pointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', resume);
    reduce.addEventListener('change', resume);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', pointer);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', resume);
      reduce.removeEventListener('change', resume);
    };
  }, []);
  return (
    <canvas className="gold-field site-field" ref={ref} aria-hidden="true" />
  );
}
