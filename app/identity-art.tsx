'use client';
import { useState } from 'react';
export function ServiceLogo({ id, name }: { id: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={'provider-logo ' + (id.startsWith('hood-') ? 'own-logo' : '')}
    >
      {failed ? (
        <b>{name.slice(0, 2)}</b>
      ) : (
        <img
          src={
            id.startsWith('hood-') ? '/art/gate.webp' : '/logos/' + id + '.png'
          }
          alt=""
          width={48}
          height={48}
          onError={() => setFailed(true)}
          loading="lazy"
        />
      )}
    </span>
  );
}
export function AgentPortrait({
  id,
  name,
  image,
}: {
  id: string;
  name: string;
  image?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={'agent-portrait portrait-' + (Number(id) % 5)}
      aria-hidden="true"
    >
      <span className="portrait-grid" />
      {image && !failed ? (
        <img
          src={image}
          alt=""
          width={80}
          height={80}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="agent-initials">
          {name
            .split(/[\s#-]+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0])
            .join('')}
        </span>
      )}
      <span className="identity-number">#{id.padStart(3, '0')}</span>
    </div>
  );
}
