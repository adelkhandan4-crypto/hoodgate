'use client';
import { useEffect, useState } from 'react';
export const short = (s: string) =>
  s ? s.slice(0, 6) + '…' + s.slice(-4) : '—';
export function useLive(kind: string, q = '') {
  const [state, setState] = useState<any>({ loading: true });
  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch(
          '/api/live/' + kind + (q ? '?q=' + encodeURIComponent(q) : ''),
        );
        const data: any = await r.json();
        if (!r.ok) throw Error(data.error);
        if (live) setState({ ...data, loading: false });
      } catch (e: any) {
        if (live)
          setState((s: any) => ({
            ...s,
            loading: false,
            error: e.message,
            stale: !!s.data,
          }));
      }
    };
    void load();
    const t = setInterval(
      () => {
        if (!document.hidden) void load();
      },
      kind === 'network' ? 30000 : 120000,
    );
    return () => {
      live = false;
      clearInterval(t);
    };
  }, [kind, q]);
  return state;
}
export function Source({ data, name }: { data: any; name: string }) {
  return (
    <p className={'source ' + (data.error ? 'warning' : '')}>
      <span className="dot" />{' '}
      {data.error
        ? data.data
          ? 'Last known data · ' + data.error
          : data.error
        : data.loading
          ? 'Fetching ' + name
          : name + ' · ' + new Date(data.at).toLocaleTimeString()}{' '}
    </p>
  );
}
export function PageHeading({
  tag,
  title,
  children,
}: {
  tag: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-head">
      <p className="eyebrow">{tag}</p>
      <h1>{title}</h1>
      {children && <p className="lead">{children}</p>}
    </div>
  );
}
export function Code({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="code-block">
      <button
        aria-label="Copy code"
        onClick={() =>
          navigator.clipboard.writeText(text).then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 1800);
          })
        }
      >
        {done ? 'Copied' : 'Copy'}
      </button>
      <pre>{text}</pre>
    </div>
  );
}
export function download(name: string, data: any) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
