'use client';
import { useState, useEffect, useRef } from 'react';
import { HeroArt, ProductArt, Art } from './product-art';
import { ProtocolCard } from './protocol-card';
import SceneNavigation from './scene-navigation';
export const products = [
  [
    'HoodMarket',
    'marketplace',
    '◇',
    'A catalog for agent-ready services. Explore offers, inspect live data and prepare your next integration.',
  ],
  [
    'HoodWallet',
    'wallet',
    '▣',
    'Connect your own browser wallet and inspect balances on Robinhood Chain. Your keys remain with you.',
  ],
  [
    'HoodIdentity',
    'agents',
    '⌘',
    'Explore ERC-8004 identity records directly from the public on-chain registry.',
  ],
  [
    'HoodAgent',
    'agent',
    '✳',
    'Compose a service request in a conversation and review its destination and parameters.',
  ],
  [
    'HoodScan',
    'scan',
    '▦',
    'Follow current Robinhood Chain activity with verifiable transaction and block links.',
  ],
  [
    'HoodSDK',
    'developers',
    '⌥',
    'Inspect offers, build merchant manifests and integrate public data with the project libraries.',
  ],
];
const stages = ['Discover', 'Request', 'Authorize', 'Settle', 'Receipt'];
export default function HomeContent({ network }: { network: any }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = root.current;
    if (!host || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const nodes = host.querySelectorAll(
      '.page-sections > section, .product-card',
    );
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top > innerHeight)
        node.classList.add('reveal-item');
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);
  const [step, setStep] = useState(0),
    [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches)
      return;
    const t = setInterval(() => setStep((s) => (s + 1) % 5), 2200);
    return () => clearInterval(t);
  }, [paused]);
  return (
    <div className="homepage" ref={root}>
      <SceneNavigation />
      <section className="hero hero-alive" id="intro">
        <HeroArt />
        <div className="hero-inner">
          <p className="eyebrow">THE MACHINE ECONOMY · ROBINHOOD CHAIN</p>
          <h1>
            <i>hood</i> gate<span>.</span>
          </h1>
          <p className="hero-description">
            A gateway for agents, builders and machine commerce. <br />
            Discover services, compose payment offers and bring <br />
            your next idea to Robinhood Chain.
          </p>
          <div className="actions">
            <a className="btn gold" href="/dashboard">
              Start building <span>→</span>
            </a>
            <a className="btn" href="/marketplace">
              Browse marketplace
            </a>
          </div>
          <div className="built">
            <small>BUILT AROUND</small>
            <div>
              MPP <span>◈ x402</span> Robinhood <span>◉ USDG</span> USDC{' '}
              <span>ERC-8004</span>
            </div>
          </div>
        </div>
      </section>
      <div
        className="protocol-ribbon"
        aria-label="Connected technologies: OpenRouter, Robinhood Chain, ERC-8004, Kraken, x402 and USDG"
      >
        <div className="protocol-track" aria-hidden="true">
          {[0, 1].map((n) => (
            <div key={n}>
              {[
                'OpenRouter',
                'Robinhood Chain',
                'ERC-8004',
                'Kraken',
                'x402',
                'USDG',
              ].map((label) => (
                <span key={label}>
                  <i>✦</i>
                  {label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <section className="intro-strip">
        <div>
          <small>LATEST BLOCK</small>
          <strong>
            {network?.block ? Number(network.block).toLocaleString() : '—'}
          </strong>
          <p>Robinhood Chain</p>
        </div>
        <div>
          <small>NETWORK GAS</small>
          <strong>
            {network?.gasGwei != null
              ? Number(network.gasGwei).toFixed(5)
              : '—'}{' '}
            <em>Gwei</em>
          </strong>
          <p>Read from the chain</p>
        </div>
        <div>
          <small>SERVICE DIRECTORY</small>
          <strong>18</strong>
          <p>Curated API integrations</p>
        </div>
      </section>
      <div className="page-sections">
        <section id="rails">
          <p className="eyebrow">THE RAILS</p>
          <h2>
            One gateway.
            <br />
            <i>Two payment standards.</i>
          </h2>
          <p className="lead">
            A service describes its price, an agent inspects the offer, and a
            wallet authorizes the request. Build around HTTP 402 with
            transparent destinations and machine-readable requirements.
          </p>
          <div className="two-grid">
            <ProtocolCard variant="mpp">
              <div className="row">
                <h3>MPP</h3>
                <span className="tag">OPEN STANDARD</span>
              </div>
              <p>
                Machine-readable offers give agents a common way to discover a
                service, understand its price and prepare a payment request.
                Start with a clear endpoint and a verifiable recipient.
              </p>
              <a
                className="text-link"
                href="https://mpp.dev"
                target="_blank"
                rel="noreferrer"
              >
                Explore the protocol ↗
              </a>
            </ProtocolCard>
            <ProtocolCard variant="x402">
              <div className="row">
                <h3>x402</h3>
                <span className="tag">USDG · ROBINHOOD CHAIN</span>
              </div>
              <p>
                Inspect the network, asset and maximum amount before a wallet
                signs anything. Configure exact-price offers for USDG and keep
                the payment boundary explicit.
              </p>
              <a className="text-link" href="/facilitator">
                Explore the facilitator →
              </a>
            </ProtocolCard>
          </div>
          <div className="two-grid code-grid">
            <article>
              <span>CLIENT / DISCOVER AN OFFER</span>
              <pre>{`import { discover } from './packages/client/index.mjs';\n\nconst offer = await discover(\n  '/api/catalog'\n);\n\n// Inspect first. Authorize deliberately.\nconsole.log(offer);`}</pre>
            </article>
            <article>
              <span>SERVER / DESCRIBE YOUR SERVICE</span>
              <pre>{`import { paymentRequirements }\n  from './packages/server/index.mjs';\n\nconst offer = paymentRequirements({\n  amount: '0.01', recipient, asset, decimals,\n  resource: 'https://your-service.com/report'\n});`}</pre>
            </article>
          </div>
          <a className="text-link" href="/developers">
            Explore the source →
          </a>
        </section>
        <section
          id="request"
          className="payment-section"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <p className="eyebrow">THE PAYMENT LIFECYCLE</p>
          <h2>Follow the request.</h2>
          <p className="lead">
            From discovery to a verifiable receipt. Hover to pause, or choose a
            step.
          </p>
          <div className="step-tabs">
            {stages.map((s, i) => (
              <button
                key={s}
                onClick={() => {
                  setStep(i);
                  setPaused(true);
                }}
                className={step === i ? 'active' : ''}
              >
                {i + 1} · {s}
              </button>
            ))}
          </div>
          <div className="flow illustrated-flow" data-step={step}>
            <div>
              <b>
                <Art kind="agent" />
              </b>
              <strong>AGENT</strong>
              <small>discovers an offer</small>
            </div>
            <span className={'flow-line ' + (step > 0 ? 'lit' : '')}></span>
            <div className="gate-node">
              <b>
                <Art kind="gate" />
              </b>
              <strong>HOODGATE</strong>
              <small>coordinates the request</small>
            </div>
            <span className={'flow-line ' + (step > 2 ? 'lit' : '')}></span>
            <div>
              <b>
                <Art kind="modules" />
              </b>
              <strong>MERCHANT</strong>
              <small>owns the endpoint</small>
            </div>
          </div>
          <pre className="terminal" key={step}>
            <span className="gold-text">$ </span>
            {
              [
                'GET /openapi.json\nInspect service, network and price.',
                'GET /report → HTTP 402\nRead the payment requirements.',
                'Review recipient + amount + expiry\nAuthorization belongs in your wallet.',
                'Submit the authorized request\nSettlement belongs to the configured payment rail.',
                'Read the transaction receipt\nVerify the result on the explorer.',
              ][step]
            }
          </pre>
        </section>
        <section id="ecosystem">
          <p className="eyebrow">THE STACK</p>
          <h2>
            A home for <i>machine commerce.</i>
          </h2>
          <div className="three-grid">
            {products.map(([name, path, icon, desc]) => (
              <a className="product-card" href={'/' + path} key={name}>
                <ProductArt product={path} />
                <span className="product-icon">{icon}</span>
                <h3>{name}</h3>
                <p>{desc}</p>
                <span className="text-link">
                  Explore {name.replace('Hood', '')} ↗
                </span>
              </a>
            ))}
          </div>
        </section>
        <section className="flywheel" id="network">
          <div>
            <p className="eyebrow">THE NETWORK EFFECT</p>
            <h2>
              Useful services.
              <br />
              <i>Connected agents.</i>
            </h2>
            <p className="lead">
              A machine economy starts with useful endpoints. Builders define
              the service. Agents discover what they need. Every step remains
              inspectable.
            </p>
            <ol>
              <li>Builders configure service offers</li>
              <li>Agents discover compatible endpoints</li>
              <li>Wallets authorize defined amounts</li>
              <li>Receipts make activity verifiable</li>
            </ol>
            <a className="text-link" href="/earn">
              Explore the rewards framework →
            </a>
          </div>
          <div className="orbit orbit-illustrated">
            <Art kind="agent" />
            <span>01 / BUILDERS</span>
            <span>02 / AGENTS</span>
            <strong className="orbit-monogram">H / G</strong>
            <span>03 / PAYMENTS</span>
            <span>04 / RECEIPTS</span>
          </div>
        </section>
        <section className="closing closing-illustrated" id="build">
          <Art kind="modules" className="closing-art" />
          <p className="eyebrow">GET STARTED</p>
          <h2>
            Your next service.
            <br />
            <i>On the machine frontier.</i>
          </h2>
          <p>
            Give your API a machine-readable offer. Explore the network around
            it.
          </p>
          <div className="actions">
            <a className="btn gold" href="/dashboard">
              Create a merchant →
            </a>
            <a className="btn" href="/marketplace">
              Explore marketplace
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
