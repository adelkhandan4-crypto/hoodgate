'use client';
import type { PointerEvent, ReactNode } from 'react';
export function ProtocolCard({
  variant,
  children,
}: {
  variant: 'mpp' | 'x402';
  children: ReactNode;
}) {
  function move(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType !== 'mouse' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width,
      y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty('--light-x', x * 100 + '%');
    event.currentTarget.style.setProperty('--light-y', y * 100 + '%');
    event.currentTarget.style.setProperty('--card-rx', (0.5 - y) * 4 + 'deg');
    event.currentTarget.style.setProperty('--card-ry', (x - 0.5) * 5 + 'deg');
  }
  return (
    <article
      className={'line-card protocol-card protocol-' + variant}
      onPointerMove={move}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty('--card-rx', '0deg');
        e.currentTarget.style.setProperty('--card-ry', '0deg');
      }}
    >
      <div className="protocol-circuit" aria-hidden="true">
        <svg viewBox="0 0 480 108" fill="none">
          <path
            className="circuit-wire"
            d="M28 54H128Q150 54 162 32T202 12H280Q306 12 318 32T352 54H452M28 54H128Q150 54 162 76T202 96H280Q306 96 318 76T352 54H452"
          />
          <path
            className="circuit-packet"
            d="M28 54H128Q150 54 162 32T202 12H280Q306 12 318 32T352 54H452"
            pathLength="100"
          />
          <path
            className="circuit-packet packet-return"
            d="M452 54H352Q330 54 318 76T280 96H202Q176 96 162 76T128 54H28"
            pathLength="100"
          />
          {[28, 240, 452].map((x, i) => (
            <g key={x} className={'circuit-node node-' + i}>
              <rect x={x - 15} y={39} width={30} height={30} rx={8} />
              <path d={`M${x - 5} 54h10M${x} 49v10`} />
            </g>
          ))}
        </svg>
        <div className="circuit-labels">
          <span>{variant === 'mpp' ? 'DISCOVER' : 'REQUEST'}</span>
          <span>{variant === 'mpp' ? 'OFFER' : 'AUTHORIZE'}</span>
          <span>{variant === 'mpp' ? 'CONNECT' : 'RECEIPT'}</span>
        </div>
      </div>
      {children}
    </article>
  );
}
