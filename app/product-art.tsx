'use client';
import type { PointerEvent } from 'react';

const assets: Record<string, string> = {
  marketplace: 'modules',
  wallet: 'gate',
  agents: 'agent',
  agent: 'agent',
  scan: 'gate',
  developers: 'modules',
};

export function Art({
  kind = 'gate',
  className = '',
}: {
  kind?: string;
  className?: string;
}) {
  return (
    <img
      className={'sculpture ' + className}
      src={'/art/' + kind + '.webp'}
      alt=""
      width={1024}
      height={1024}
      loading="lazy"
      decoding="async"
    />
  );
}

export function ProductArt({ product }: { product: string }) {
  return (
    <div className={'product-art product-art-' + product} aria-hidden="true">
      <div className="art-reticle" />
      <Art kind={assets[product] || 'gate'} />
      <span className="art-coordinate">H/G — {product.toUpperCase()}</span>
      <span className="art-cross">+</span>
    </div>
  );
}

export function HeroArt() {
  function move(e: PointerEvent<HTMLDivElement>) {
    if (
      e.pointerType !== 'mouse' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      '--rx',
      ((e.clientY - r.top) / r.height - 0.5) * -10 + 'deg',
    );
    e.currentTarget.style.setProperty(
      '--ry',
      ((e.clientX - r.left) / r.width - 0.5) * 12 + 'deg',
    );
  }
  return (
    <div
      className="hero-art"
      onPointerMove={move}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty('--rx', '0deg');
        e.currentTarget.style.setProperty('--ry', '0deg');
      }}
      aria-hidden="true"
    >
      <div className="portal-satellites">
        {['openrouter', 'anthropic', 'openai', 'kraken'].map((id, i) => (
          <span
            className="portal-satellite"
            key={id}
            style={{ '--delay': -i * 9.5 + 's' } as React.CSSProperties}
          >
            <img src={'/logos/' + id + '.png'} alt="" width={24} height={24} />
          </span>
        ))}
      </div>
      <div className="hero-orbit orbit-one" />
      <div className="hero-orbit orbit-two" />
      <svg width="0" height="0" className="art-filter-defs" aria-hidden="true">
        <defs>
          <filter id="gold-background-key" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  2 3 1 0 -0.24"
            />
          </filter>
        </defs>
      </svg>
      <div className="hero-sculpture">
        <img
          src="/art/gate.webp"
          alt=""
          width={1024}
          height={1024}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <span className="art-chip chip-top">
        <i /> AGENT-READY SERVICES
      </span>
      <span className="art-chip chip-bottom">
        <span>↗</span> BUILT TO CONNECT
      </span>
      <span className="hero-art-label">01 / THE GATEWAY</span>
    </div>
  );
}
