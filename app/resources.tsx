'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeading, Code, short } from './shared';
import { services, USDG } from '@/lib/catalog';
import { products } from './home-content';
export const articles = [
  {
    slug: 'machine-readable-commerce',
    title: 'An API with an offer.',
    tag: 'BUILDERS',
    text: 'An endpoint tells a client what it can request. A machine-readable offer adds the network, asset, price and recipient. Keeping these together makes service discovery inspectable before any funds move. Start with one useful resource and one clear price. HoodGate exports the service description as OpenAPI, so the integration remains portable.',
  },
  {
    slug: 'before-the-signature',
    title: 'Before the signature.',
    tag: 'PAYMENTS',
    text: 'A payment request deserves the same scrutiny as a transaction. Read the complete recipient, the chain identifier, the asset contract and the expiry. A recognisable ticker is not an identity check. The review step should show the exact requirements and leave authorization with the wallet. Discovery never needs a private key.',
  },
  {
    slug: 'identity-is-portable',
    title: 'Identity beyond a session.',
    tag: 'IDENTITY',
    text: 'ERC-8004 provides a shared format for agent identity. A public identity record can reference an agent service while ownership remains independently verifiable on the explorer. Registration alone does not prove trust, service quality or endorsement. Inspect the owner, metadata and source of each record.',
  },
];
export function Resources({
  page,
  wallet,
  onConnect,
}: {
  page: string;
  wallet: any;
  onConnect: () => void;
}) {
  const [tab, setTab] = useState(0),
    [message, setMessage] = useState(''),
    [messages, setMessages] = useState<string[]>([]),
    [choice, setChoice] = useState('hood-markets'),
    [review, setReview] = useState(false);
  if (page === 'wallet')
    return (
      <>
        <PageHeading
          tag="HOODWALLET / SELF-CUSTODY"
          title="Your wallet. Your control."
        >
          Connect an installed wallet and read its Robinhood Chain balances.
          Private keys stay inside your wallet.
        </PageHeading>
        <div className="two-grid">
          <section className="work-panel">
            <h2>Browser wallet</h2>
            <dl className="details">
              <dt>Account</dt>
              <dd>
                {wallet.account ? short(wallet.account) : 'Connect a wallet'}
              </dd>
              <dt>Network</dt>
              <dd>
                {wallet.chain === '0x1237'
                  ? 'Robinhood Chain'
                  : wallet.chain || '—'}
              </dd>
              <dt>ETH</dt>
              <dd>{wallet.balances.eth ?? '—'}</dd>
              <dt>USDG</dt>
              <dd>{wallet.balances.usdg ?? '—'}</dd>
            </dl>
            <Button className="btn gold" onClick={onConnect}>
              {wallet.account ? 'Manage wallet' : 'Connect wallet'} →
            </Button>
          </section>
          <section className="work-panel">
            <h2>Agent connection</h2>
            <p>
              Generate a service manifest in the builder, then load it into your
              agent tooling. The client source can inspect offers without access
              to a signing key.
            </p>
            <Code
              text={`import { discover } from './packages/client/index.mjs';\nconst catalog = await discover('http://127.0.0.1:8986/api/catalog');\nconsole.log(catalog.services);`}
            />
            <a className="text-link" href="/developers">
              Explore the client source ↗
            </a>
          </section>
        </div>
        <section className="work-panel">
          <h2>Connect. Inspect. Decide.</h2>
          <div className="three-grid">
            <div>
              <h3>01 / Connect</h3>
              <p>
                Select MetaMask, Rainbow or another compatible browser wallet.
              </p>
            </div>
            <div>
              <h3>02 / Check the chain</h3>
              <p>
                Choose Robinhood Chain in your wallet. Verify the network before
                reviewing a request.
              </p>
            </div>
            <div>
              <h3>03 / Inspect balances</h3>
              <p>
                Balances are read from your wallet provider. No approval or
                signature is requested to display them.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  if (page === 'ecosystem')
    return (
      <>
        <PageHeading tag="THE ECOSYSTEM" title="One connected stack.">
          Explore the building blocks of agent commerce on Robinhood Chain.
        </PageHeading>
        <div className="three-grid">
          {products.map(([n, p, i, d]) => (
            <a className="product-card" href={'/' + p} key={n}>
              <span className="product-icon">{i}</span>
              <h2>{n}</h2>
              <p>{d}</p>
              <span className="text-link">Open {n} ↗</span>
            </a>
          ))}
        </div>
      </>
    );
  if (page === 'earn' || page === 'leaderboard' || page === 'claim')
    return (
      <>
        <PageHeading
          tag="HOODGATE / NETWORK REWARDS"
          title={
            page === 'leaderboard'
              ? 'Network leaderboard.'
              : page === 'claim'
                ? 'Review your eligibility.'
                : 'A network worth building.'
          }
        >
          Inspect eligibility and distribution records for the project token.
        </PageHeading>
        <div className="stat-grid">
          <div>
            <small>TOKEN CONTRACT</small>
            <strong>To be announced</strong>
          </div>
          <div>
            <small>DISTRIBUTIONS</small>
            <strong>—</strong>
          </div>
          <div>
            <small>REWARDS POOL</small>
            <strong>—</strong>
          </div>
        </div>
        <section className="work-panel">
          <div className="row">
            <h2>Your eligibility</h2>
            <Button className="btn" onClick={onConnect}>
              {wallet.account ? short(wallet.account) : 'Connect wallet'}
            </Button>
          </div>
          <dl className="details">
            <dt>Wallet</dt>
            <dd>{wallet.account ? short(wallet.account) : '—'}</dd>
            <dt>Project token balance</dt>
            <dd>—</dd>
            <dt>Claimable amount</dt>
            <dd>—</dd>
          </dl>
          <Button className="btn gold" onClick={() => setReview(true)}>
            Review claim →
          </Button>
          {review && (
            <div className="review-inline">
              <h3>Claim summary</h3>
              <p>
                Account:{' '}
                {wallet.account ? short(wallet.account) : 'Connect your wallet'}
              </p>
              <p>Distribution: —</p>
              <Button
                className="btn gold"
                disabled
                title="A published distribution and proof are required"
              >
                Claim allocation
              </Button>
            </div>
          )}
        </section>
        <div className="tabs">
          {["Today's standings", 'Last distribution', 'All distributions'].map(
            (t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={tab === i ? 'active' : ''}
              >
                {t}
              </button>
            ),
          )}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{tab === 2 ? 'Epoch' : 'Wallet'}</th>
                <th>Balance</th>
                <th>Share</th>
                <th>Allocation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="empty">
                  No published{' '}
                  {tab === 0
                    ? 'eligibility'
                    : tab === 1
                      ? 'distribution'
                      : 'epoch'}{' '}
                  records.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  if (page === 'token' || page === 'hood' || page === 'mesh')
    return (
      <>
        <PageHeading
          tag="HOODGATE / THE TOKEN"
          title="The next network chapter."
        >
          Follow the official project source for token details and verified
          contract information.
        </PageHeading>
        <div className="two-grid">
          <section className="work-panel">
            <span className="large-mark">▦</span>
            <h2>HoodGate</h2>
            <p>Built around the machine economy on Robinhood Chain.</p>
            <dl className="details">
              <dt>Network</dt>
              <dd>Robinhood Chain</dd>
              <dt>Ticker</dt>
              <dd>To be announced</dd>
              <dt>Contract</dt>
              <dd>To be announced</dd>
            </dl>
          </section>
          <section className="work-panel">
            <h2>Verify the source.</h2>
            <p>
              A project name is not a contract address. Once token information
              is published, verify the full address and network before
              interacting.
            </p>
            <a className="btn" href="/developers">
              Project source ↗
            </a>
            <a className="text-link block" href="/earn">
              Explore distribution records →
            </a>
          </section>
        </div>
      </>
    );
  if (page === 'agent')
    return (
      <>
        <PageHeading
          tag="HOODAGENT / REQUEST COMPOSER"
          title="A conversation with the network."
        >
          Describe a request, choose its service and inspect the request before
          authorization.
        </PageHeading>
        <section className="work-panel chat-panel">
          <div className="chat-log">
            <p className="assistant-message">
              What would you like to explore? Choose an API below and describe
              the result you need.
            </p>
            {messages.map((m, i) => (
              <div key={i}>
                <p className="user-message">{m}</p>
                <p className="assistant-message">
                  Prepared a request for{' '}
                  {services.find((s) => s.id === choice)?.name}. Review its
                  endpoint and parameters below.
                </p>
              </div>
            ))}
          </div>
          <label>
            Service
            <select value={choice} onChange={(e) => setChoice(e.target.value)}>
              {services.map((s) => (
                <option value={s.id} key={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <form
            className="input-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (message.trim()) {
                setMessages((a) => [...a, message.trim()]);
                setMessage('');
                setReview(true);
              }
            }}
          >
            <input
              aria-label="Describe your request"
              value={message}
              maxLength={500}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the data you need…"
            />
            <Button className="btn gold" type="submit">
              Prepare →
            </Button>
          </form>
          {review && (
            <div className="review-inline">
              <h3>{services.find((s) => s.id === choice)?.name}</h3>
              <Code
                text={JSON.stringify(
                  {
                    service: choice,
                    request: messages.at(-1),
                    network: 'eip155:4663',
                    wallet: wallet.account || null,
                  },
                  null,
                  2,
                )}
              />
              <a className="btn" href={'/marketplace/' + choice}>
                Inspect live endpoint →
              </a>
              <Button
                className="btn gold"
                disabled
                title="A configured payment offer is required"
              >
                Authorize request
              </Button>
            </div>
          )}
        </section>
      </>
    );
  if (page === 'blog' || page.startsWith('blog/')) {
    const article = articles.find((a) => 'blog/' + a.slug === page);
    return article ? (
      <>
        <a className="text-link" href="/blog">
          ← Journal
        </a>
        <PageHeading tag={article.tag} title={article.title} />
        <article className="prose">
          <p>{article.text}</p>
          <a className="btn" href="/dashboard">
            Open the builder →
          </a>
        </article>
      </>
    ) : (
      <>
        <PageHeading
          tag="HOODGATE / JOURNAL"
          title="Notes from the machine frontier."
        >
          Design decisions and practical guides for builders.
        </PageHeading>
        <div className="three-grid">
          {articles.map((a, i) => (
            <a
              className="product-card article"
              href={'/blog/' + a.slug}
              key={a.slug}
            >
              <div className={'article-art art-' + i}>
                <span>{['402', '0x', '8004'][i]}</span>
              </div>
              <p className="eyebrow">{a.tag}</p>
              <h2>{a.title}</h2>
              <p>{a.text.slice(0, 115)}…</p>
              <span className="text-link">Read article →</span>
            </a>
          ))}
        </div>
      </>
    );
  }
  if (page === 'facilitator')
    return (
      <>
        <PageHeading
          tag="INFRASTRUCTURE / x402"
          title="A clear payment boundary."
        >
          Inspect payment requirements and build an exact-price request for
          Robinhood Chain.
        </PageHeading>
        <div className="two-grid">
          <section className="work-panel">
            <h2>Robinhood Chain</h2>
            <dl className="details">
              <dt>Network</dt>
              <dd>eip155:4663</dd>
              <dt>Asset</dt>
              <dd>USDG</dd>
              <dt>Asset contract</dt>
              <dd>{short(USDG)}</dd>
              <dt>Scheme</dt>
              <dd>exact / Permit2</dd>
            </dl>
            <a className="text-link" href="/status">
              Live network status ↗
            </a>
          </section>
          <section className="work-panel">
            <h2>Endpoints</h2>
            <div className="endpoint">
              <b>GET</b>
              <code>/api/catalog</code>
              <p>Available service descriptions and public data routes.</p>
            </div>
            <div className="endpoint">
              <b>GET</b>
              <code>/api/live/network</code>
              <p>Current chain state and recent public transactions.</p>
            </div>
            <a className="text-link" href="/docs">
              Integration documentation →
            </a>
          </section>
        </div>
        <Code
          text={`import { paymentRequirements } from './packages/server/index.mjs';\nconst requirements = paymentRequirements({\n  amount: '0.01',\n  recipient: '0xYourWallet',\n  resource: 'https://your-service.com/report'\n});`}
        />
        <a className="btn gold" href="/dashboard">
          Configure a service →
        </a>
      </>
    );
  return (
    <>
      <PageHeading
        tag="DEVELOPERS / HOODGATE"
        title={page === 'developers' ? 'Build in the open.' : 'Documentation'}
      >
        Source code, service manifests and data integration guides.
      </PageHeading>
      <div className="docs-layout">
        <nav className="docs-nav">
          {[
            ['Overview', '/docs'],
            ['Merchant setup', '/docs/merchant'],
            ['Payment requirements', '/docs/payments'],
            ['Client & server SDK', '/developers'],
            ['Wallet connection', '/wallet'],
            ['OpenAPI', '/openapi.json'],
            ['Data sources', '/docs/data'],
          ].map(([t, p]) => (
            <a href={p} key={p}>
              {t}
            </a>
          ))}
        </nav>
        <article className="prose">
          <h2>
            {page === 'developers'
              ? 'HoodGate source'
              : 'From an endpoint to an offer'}
          </h2>
          <p>
            HoodGate combines a service directory, a merchant manifest builder,
            wallet balance reads and live Robinhood Chain observations. Choose a
            service to inspect current data, or configure your own service and
            export its OpenAPI document.
          </p>
          <div className="actions left">
            <a className="btn gold" href="/hoodgate-source.zip" download>
              Download source ↗
            </a>
            <a
              className="btn"
              href="https://github.com/adelkhandan4-crypto/hoodgate"
              target="_blank"
              rel="noreferrer"
            >
              GitHub repository ↗
            </a>
          </div>
          <h3>Quick start</h3>
          <Code
            text={
              'npm install\nnpm run dev -- --hostname 127.0.0.1 --port 8986'
            }
          />
          <h3>Client library</h3>
          <Code
            text={`import { discover, readData } from './packages/client/index.mjs';\nconst origin = 'http://127.0.0.1:8986';\nconst catalog = await discover(origin + '/api/catalog');\nconst network = await readData(origin, 'network');`}
          />
          <h3>Merchant builder</h3>
          <p>
            Set a public HTTPS origin, full payout address and unique endpoint
            paths. Prices accept up to six decimal places. A saved definition
            belongs to this browser; an exported manifest is portable.
          </p>
          <h3>Data sources</h3>
          <ul>
            <li>
              <a
                href="https://robinhoodchain.blockscout.com"
                target="_blank"
                rel="noreferrer"
              >
                Blockscout
              </a>
              : chain activity and shared ERC-8004 identity records.
            </li>
            <li>
              <a
                href="https://openrouter.ai/docs"
                target="_blank"
                rel="noreferrer"
              >
                OpenRouter
              </a>
              : current model metadata and provider token prices.
            </li>
            <li>
              <a
                href="https://docs.dexscreener.com/api/reference"
                target="_blank"
                rel="noreferrer"
              >
                DEX Screener
              </a>
              : public Robinhood Chain token pools.
            </li>
            <li>
              Kraken, Open-Meteo, DeFiLlama, Algolia, Wikipedia and GitHub:
              their respective public data APIs.
            </li>
          </ul>
          <h3>Signing boundary</h3>
          <p>
            Discovery, configuration and balance reads require no payment
            signature. Settlement adapters are separate from the public data
            layer. Final publication and payment controls do not send
            transactions in this release.
          </p>
          <h3>Wallet support</h3>
          <p>
            EIP-6963 discovery and EIP-1193 compatible browser wallets. Account
            and network changes refresh balances. No seed phrases, private keys
            or signing credentials are stored by this site.
          </p>
        </article>
      </div>
    </>
  );
}
