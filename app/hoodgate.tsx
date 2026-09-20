'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import HomeContent from './home-content';
import {
  Marketplace,
  ServiceDetail,
  Builder,
  Registry,
  Network,
} from './workspaces';
import { Resources } from './resources';
import { useWallet } from './use-wallet';
import { short, useLive, PageHeading } from './shared';
import { services } from '@/lib/catalog';
import { LaunchSettings, ContractBar, SocialLink } from './launch-settings';
import { flushSync } from 'react-dom';
export default function HoodGate({
  initialPath = '/',
}: {
  initialPath?: string;
}) {
  const [path, setPath] = useState(initialPath),
    [walletOpen, setWalletOpen] = useState(false),
    [lang, setLang] = useState(false);
  const wallet = useWallet(),
    network = useLive('network');
  const page = path.replace(/^\//, '');
  const connect = () => setWalletOpen(true);
  function navigate(url: string) {
    const change = () => {
      history.pushState({}, '', url);
      flushSync(() => setPath(new URL(url, location.origin).pathname));
      scrollTo({ top: 0, behavior: 'instant' });
    };
    const transitionDocument = document as Document & {
      startViewTransition?: (update: () => void) => unknown;
    };
    if (
      transitionDocument.startViewTransition &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      transitionDocument.startViewTransition(change);
    else change();
  }
  useEffect(() => {
    const back = () => setPath(location.pathname);
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a');
      if (
        !a ||
        a.target ||
        a.hasAttribute('download') ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const u = new URL(a.href);
      if (
        u.origin !== location.origin ||
        u.hash ||
        u.pathname.endsWith('.json') ||
        u.pathname.endsWith('.zip')
      )
        return;
      e.preventDefault();
      navigate(u.pathname + u.search);
    };
    window.addEventListener('popstate', back);
    document.addEventListener('click', click);
    return () => {
      window.removeEventListener('popstate', back);
      document.removeEventListener('click', click);
    };
  }, []);
  useEffect(() => {
    document.title =
      (path === '/' ? 'HoodGate' : page.split('/')[0] + ' · HoodGate') +
      ' — Robinhood Chain';
  }, [path, page]);
  useEffect(() => {
    const ctx = (document as any).modelContext;
    if (!ctx?.registerTool) return;
    const controller = new AbortController();
    const tools = [
      {
        name: 'read_service_catalog',
        title: 'Read HoodGate services',
        description:
          'Read the public service directory. Does not access wallets or send payments.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
        execute: (input: unknown) => {
          if (
            !input ||
            typeof input !== 'object' ||
            Array.isArray(input) ||
            Object.keys(input).length
          )
            throw Error('Expected an empty object');
          return {
            services: services.map((s) => ({
              id: s.id,
              name: s.name,
              category: s.category,
            })),
            executionEnabled: false,
          };
        },
      },
      {
        name: 'start_merchant_builder',
        title: 'Open merchant builder',
        description:
          'Navigate to the service configuration form. Does not save, publish or sign anything.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false },
        execute: (input: unknown) => {
          if (
            !input ||
            typeof input !== 'object' ||
            Array.isArray(input) ||
            Object.keys(input).length
          )
            throw Error('Expected an empty object');
          navigate('/dashboard');
          return { path: '/dashboard', published: false };
        },
      },
    ];
    for (const t of tools)
      Promise.resolve(ctx.registerTool(t, { signal: controller.signal })).catch(
        () => {},
      );
    return () => controller.abort();
  }, []);
  let content;
  if (!page) content = <HomeContent network={network.data} />;
  else if (page === 'marketplace') content = <Marketplace />;
  else if (page.startsWith('marketplace/'))
    content = (
      <ServiceDetail
        id={page.split('/')[1]}
        wallet={wallet}
        onConnect={connect}
      />
    );
  else if (page === 'dashboard' || page === 'dashboard/new')
    content = <Builder wallet={wallet} onConnect={connect} />;
  else if (page === 'agents' || page.startsWith('agents/'))
    content = <Registry detail={page.split('/')[1]} />;
  else if (page === 'status' || page === 'scan')
    content = <Network scan={page === 'scan'} />;
  else if (
    [
      'wallet',
      'ecosystem',
      'earn',
      'leaderboard',
      'claim',
      'token',
      'hood',
      'mesh',
      'agent',
      'blog',
      'facilitator',
      'developers',
      'docs',
      'sdk',
    ].includes(page) ||
    page.startsWith('blog/') ||
    page.startsWith('docs/')
  )
    content = <Resources page={page} wallet={wallet} onConnect={connect} />;
  else
    content = (
      <PageHeading tag="404" title="This route is not in the network.">
        <a href="/">Return to HoodGate →</a>
      </PageHeading>
    );
  return (
    <LaunchSettings>
      <div className="site-chrome">
        <ContractBar />
        <header className="header">
          <a href="/" className="brand">
            <span className="brand-sculpture">
              <img src="/art/gate.webp" alt="" width={48} height={48} />
            </span>
            <i>hood</i>
            <b>gate.</b>
          </a>
          <nav>
            {[
              ['Marketplace', '/marketplace'],
              ['Agents', '/agents'],
              ['Earn', '/earn'],
              ['Blog', '/blog'],
              ['Token', '/token'],
            ].map(([label, url]) => (
              <a
                className={path.startsWith(url) ? 'active' : ''}
                href={url}
                key={url}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-tools">
            <SocialLink />
            <a href="/docs" aria-label="Documentation">
              Docs ↗
            </a>
            <a
              href="https://github.com/adelkhandan4-crypto/hoodgate"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub and source"
            >
              GitHub ↗
            </a>
            <div className="language">
              <button
                onClick={() => setLang(!lang)}
                aria-expanded={lang}
                aria-label="Language"
              >
                EN ⌄
              </button>
              {lang && (
                <div>
                  <button onClick={() => setLang(false)}>English ✓</button>
                </div>
              )}
            </div>
            <Button className="btn" onClick={connect}>
              {wallet.account ? short(wallet.account) : 'Connect'}
            </Button>
          </div>
        </header>
      </div>
      <main className={page ? 'workspace-page' : ''} data-page={page || 'home'}>
        <div className="route-content" key={page}>
          {content}
        </div>
      </main>
      <footer>
        <div className="footer-social">
          <SocialLink />
        </div>
        <div className="footer-brand">
          <a href="/" className="brand">
            <span className="brand-sculpture">
              <img src="/art/gate.webp" alt="" width={48} height={48} />
            </span>
            <i>hood</i>
            <b>gate.</b>
          </a>
          <p>
            A gateway to machine commerce.
            <br />
            Discover services. Compose offers.
            <br />
            Explore Robinhood Chain.
          </p>
        </div>
        {[
          [
            'Product',
            ['Marketplace', 'Dashboard', 'Ecosystem', 'Earn', 'Token'],
          ],
          [
            'Resources',
            ['Blog', 'Docs', 'Wallet', 'Scan', 'Leaderboard', 'Status'],
          ],
          ['Developers', ['Facilitator', 'Developers', 'OpenAPI']],
        ].map(([label, links]) => (
          <div key={label as string}>
            <h3>{label as string}</h3>
            {(links as string[]).map((t) => (
              <a
                key={t}
                href={t === 'OpenAPI' ? '/openapi.json' : '/' + t.toLowerCase()}
              >
                {t === 'Developers'
                  ? 'GitHub & SDK'
                  : t === 'Scan'
                    ? 'HoodScan'
                    : t}
              </a>
            ))}
          </div>
        ))}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} HoodGate</span>
          <span>
            Independent project. Not affiliated with Robinhood or listed API
            providers.
          </span>
        </div>
      </footer>
      <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
        <DialogContent className="modal">
          <DialogTitle>
            {wallet.account ? 'Your wallet' : 'Connect a wallet'}
          </DialogTitle>
          <DialogDescription>
            Use an installed browser wallet. Your keys stay with you.
          </DialogDescription>
          {wallet.account ? (
            <>
              <dl className="details">
                <dt>Address</dt>
                <dd>{short(wallet.account)}</dd>
                <dt>Network</dt>
                <dd>
                  {wallet.chain === '0x1237' ? 'Robinhood Chain' : wallet.chain}
                </dd>
                <dt>ETH</dt>
                <dd>{wallet.balances.eth ?? '—'}</dd>
                <dt>USDG</dt>
                <dd>{wallet.balances.usdg ?? '—'}</dd>
              </dl>
              {wallet.chain !== '0x1237' && (
                <Button className="btn gold" onClick={wallet.switchChain}>
                  Switch to Robinhood
                </Button>
              )}
              <Button className="btn" onClick={() => wallet.refresh()}>
                Refresh balances
              </Button>
              <Button className="btn" onClick={wallet.disconnect}>
                Disconnect
              </Button>
            </>
          ) : wallet.providers.length ? (
            wallet.providers.map((p: any) => (
              <Button
                key={p.info.uuid}
                className="btn wallet-choice"
                disabled={wallet.busy}
                onClick={() => wallet.connect(p.provider)}
              >
                {p.info.name} <span>↗</span>
              </Button>
            ))
          ) : (
            <>
              <p>No browser wallet was detected.</p>
              <div className="actions left">
                <a
                  className="btn"
                  href="https://metamask.io/download"
                  target="_blank"
                  rel="noreferrer"
                >
                  MetaMask ↗
                </a>
                <a
                  className="btn"
                  href="https://rainbow.me"
                  target="_blank"
                  rel="noreferrer"
                >
                  Rainbow ↗
                </a>
              </div>
            </>
          )}
          {wallet.error && <p className="error">{wallet.error}</p>}
        </DialogContent>
      </Dialog>
    </LaunchSettings>
  );
}
