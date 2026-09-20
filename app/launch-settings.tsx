'use client';
import { createContext, useContext, useEffect, useState } from 'react';
type Settings = { contract: string; network: string; twitter: string };
const defaults: Settings = {
  contract: '',
  network: 'Robinhood Chain',
  twitter: '',
};
const Context = createContext(defaults);
export function LaunchSettings({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaults);
  useEffect(() => {
    let stopped = false,
      loading = false;
    let active: AbortController | undefined;
    async function refresh() {
      if (stopped || loading || document.hidden) return;
      loading = true;
      active = new AbortController();
      const timer = setTimeout(() => active?.abort(), 3500);
      try {
        const r = await fetch(
          '/token.json?v=' + Math.floor(Date.now() / 5000),
          { cache: 'no-store', credentials: 'omit', signal: active.signal },
        );
        if (!r.ok) throw Error('Configuration unavailable');
        const data = (await r.json()) as Partial<Settings>;
        if (
          typeof data.contract !== 'string' ||
          (data.contract && !/^0x[0-9a-fA-F]{40}$/.test(data.contract))
        )
          return;
        let twitter = '';
        if (data.twitter) {
          const url = new URL(data.twitter);
          if (
            url.protocol === 'https:' &&
            ['x.com', 'twitter.com'].includes(url.hostname) &&
            !url.username &&
            !url.password
          )
            twitter = url.href;
        }
        if (!stopped)
          setSettings({
            contract: data.contract,
            network: 'Robinhood Chain',
            twitter,
          });
      } catch {
        /* Keep the last valid configuration during a temporary outage. */
      } finally {
        clearTimeout(timer);
        loading = false;
      }
    }
    void refresh();
    const timer = setInterval(() => void refresh(), 5000);
    const visible = () => void refresh();
    document.addEventListener('visibilitychange', visible);
    return () => {
      stopped = true;
      active?.abort();
      clearInterval(timer);
      document.removeEventListener('visibilitychange', visible);
    };
  }, []);
  return <Context.Provider value={settings}>{children}</Context.Provider>;
}
export const useLaunchSettings = () => useContext(Context);
export function ContractBar() {
  const { contract, network } = useLaunchSettings();
  const [status, setStatus] = useState('');
  useEffect(() => {
    setStatus('');
  }, [contract]);
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(''), 2500);
    return () => clearTimeout(timer);
  }, [status]);
  return (
    <div className="contract-rail">
      <span className="rail-network">
        <i />
        {network}
      </span>
      <span className="contract-caption">OFFICIAL CA</span>
      {contract ? (
        <>
          <code title={contract}>{contract}</code>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(contract);
                setStatus('Copied');
              } catch {
                setStatus('Select the address to copy');
              }
            }}
            aria-label="Copy official contract"
          >
            {status === 'Copied' ? 'Copied ✓' : 'Copy ↗'}
          </button>
        </>
      ) : (
        <span className="contract-empty">Contract will be announced here</span>
      )}
      <span className="contract-feedback" role="status">
        {status && status !== 'Copied' ? status : ''}
      </span>
    </div>
  );
}
export function SocialLink() {
  const { twitter } = useLaunchSettings();
  const icon = (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.3-8.5L.8 2h6.5l5.3 7.1L18.9 2Zm-1.1 18h1.7L6.4 3.9H4.6L17.8 20Z"
      />
    </svg>
  );
  return twitter ? (
    <a
      className="social-x"
      href={twitter}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="HoodGate on X"
    >
      {icon}
    </a>
  ) : (
    <button
      className="social-x"
      disabled
      title="Official X account coming soon"
      aria-label="Official X account coming soon"
    >
      {icon}
    </button>
  );
}
