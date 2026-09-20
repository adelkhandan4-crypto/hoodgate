'use client';
import { useEffect, useState } from 'react';
const chapters = [
  ['intro', 'Start'],
  ['rails', 'The rails'],
  ['request', 'The request'],
  ['ecosystem', 'The stack'],
  ['network', 'The network'],
  ['build', 'Build'],
];
export default function SceneNavigation() {
  const [active, setActive] = useState('intro');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-25% 0px -50% 0px' },
    );
    for (const [id] of chapters) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, []);
  return (
    <nav className="chapter-nav" aria-label="Page chapters">
      {chapters.map(([id, label], i) => (
        <a
          key={id}
          href={'#' + id}
          aria-label={label}
          aria-current={active === id ? 'location' : undefined}
        >
          <span>
            {String(i + 1).padStart(2, '0')} / {label}
          </span>
          <i />
        </a>
      ))}
    </nav>
  );
}
