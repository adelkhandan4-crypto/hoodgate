'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ServiceLogo, AgentPortrait } from './identity-art';
import { Art } from './product-art';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  services,
  categories,
  REGISTRY,
  validateMerchant,
  merchantSpec,
} from '@/lib/catalog';
import { PageHeading, Code, Source, useLive, short, download } from './shared';
const money = (n: any) =>
  Number.isFinite(Number(n))
    ? '$' +
      Number(n).toLocaleString('en-US', {
        maximumFractionDigits: Number(n) < 1 ? 6 : 2,
      })
    : '—';
export function Marketplace() {
  const [category, setCategory] = useState('AI Models'),
    [query, setQuery] = useState(''),
    models = useLive('models');
  const filtered = services.filter((s) =>
    query
      ? (s.name + ' ' + s.description)
          .toLowerCase()
          .includes(query.toLowerCase())
      : s.category === category,
  );
  return (
    <>
      <div className="directory-intro market-intro">
        <div>
          <p className="eyebrow">THE SERVICE EXCHANGE / 01</p>
          <h1>
            Find your next
            <br />
            <i>connection.</i>
          </h1>
          <p>
            Models, market feeds and on-chain intelligence.
            <br />
            One place to find the service behind your next idea.
          </p>
          <div className="directory-facts">
            <span>
              <strong>{services.length}</strong> services
            </span>
            <span>
              <strong>{categories.length}</strong> categories
            </span>
            <span>
              <strong>{models.data?.length || '—'}</strong> models
            </span>
          </div>
        </div>
        <div className="directory-art" aria-hidden="true">
          <Art kind="modules" />
          <span>DISCOVER / CONNECT / BUILD</span>
        </div>
      </div>
      <div className="filter-bar">
        <div className="tabs">
          {categories.map((c) => (
            <button
              className={c === category ? 'active' : ''}
              key={c}
              onClick={() => {
                setCategory(c);
                setQuery('');
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          aria-label="Search services"
          placeholder="Search services…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="four-grid catalog-grid" key={category + query}>
        {filtered.map((s) => {
          const subset = models.data?.filter(
            (m: any) => !s.provider || m.id.startsWith(s.provider),
          );
          return (
            <a
              className="service-card"
              href={'/marketplace/' + s.id}
              key={s.id}
            >
              <ServiceLogo id={s.id} name={s.name} />
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <div className="row">
                <small>
                  {s.category === 'AI Models'
                    ? subset?.length
                      ? subset.length + ' models'
                      : 'Model discovery'
                    : 'Public API'}
                </small>
                <span>↗</span>
              </div>
            </a>
          );
        })}
      </div>
      {!filtered.length && (
        <div className="empty">No matching services. Try another name.</div>
      )}
      <Source data={models} name="OpenRouter model metadata" />
      <div className="section-head">
        <div>
          <p className="eyebrow">ROBINHOOD NATIVE</p>
          <h2>Look under the hood.</h2>
        </div>
        <a className="text-link" href="/facilitator">
          Build an x402 service ↗
        </a>
      </div>
      <div className="three-grid">
        {services
          .filter((s) => s.category === 'Blockchain')
          .map((s) => (
            <a
              className="product-card"
              href={'/marketplace/' + s.id}
              key={s.id}
            >
              <ServiceLogo id={s.id} name={s.name} />
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <span className="text-link">Explore live data ↗</span>
            </a>
          ))}
      </div>
      <div className="section-head">
        <h2>Built by you.</h2>
        <a className="btn" href="/dashboard">
          Create a merchant →
        </a>
      </div>
      <p className="lead">
        Describe your service, define an offer and prepare its machine-readable
        manifest.
      </p>
    </>
  );
}
export function ServiceDetail({
  id,
  wallet,
  onConnect,
}: {
  id: string;
  wallet: any;
  onConnect: () => void;
}) {
  const s = services.find((s) => s.id === id);
  const [query, setQuery] = useState(''),
    [search, setSearch] = useState(''),
    [show, setShow] = useState(false),
    [review, setReview] = useState(false);
  const data = useLive(s?.read || 'network', search);
  if (!s)
    return (
      <PageHeading tag="MARKETPLACE" title="Service not found">
        Return to the directory to choose a supported service.
      </PageHeading>
    );
  const items = s.provider
    ? data.data?.filter((m: any) => m.id.startsWith(s.provider))
    : data.data;
  return (
    <>
      <a className="text-link" href="/marketplace">
        ← Marketplace
      </a>
      <PageHeading tag={s.category + ' / PUBLIC DATA'} title={s.name}>
        {s.description}
      </PageHeading>
      <div className="row detail-meta">
        <ServiceLogo id={s.id} name={s.name} />
        <span className="tag">
          {s.category === 'Blockchain'
            ? 'Robinhood Chain'
            : 'External data source'}
        </span>
        <a href={s.source} target="_blank" rel="noreferrer">
          Official source ↗
        </a>
      </div>
      <h2>Offers</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Endpoint</th>
              <th>Access</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>{s.name}</strong>
                <p>{s.description}</p>
              </td>
              <td>
                <code>{s.path}</code>
              </td>
              <td>Read public data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <section className="work-panel">
        <div className="section-head">
          <h2>Try the endpoint.</h2>
          <span className="tag">GET</span>
        </div>
        {['search', 'wiki', 'commons', 'github'].includes(s.read) && (
          <div className="input-row">
            <input
              aria-label="Search query"
              value={query}
              placeholder="Enter a search term"
              maxLength={100}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              className="btn"
              onClick={() => {
                setSearch(query);
                setShow(true);
              }}
            >
              Search
            </Button>
          </div>
        )}
        <div className="actions left">
          <Button className="btn gold" onClick={() => setShow(true)}>
            Read current data →
          </Button>
          <Button className="btn" onClick={() => setReview(true)}>
            Prepare payment request
          </Button>
        </div>
        <Source
          data={data}
          name={
            s.category === 'AI Models'
              ? 'OpenRouter'
              : new URL(s.source).hostname
          }
        />
        {show &&
          (data.loading ? (
            <p>Loading current records…</p>
          ) : s.read === 'models' ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Context</th>
                    <th>Input / 1M</th>
                    <th>Output / 1M</th>
                  </tr>
                </thead>
                <tbody>
                  {(items || []).slice(0, 30).map((m: any) => (
                    <tr key={m.id}>
                      <td>
                        {m.name}
                        <small>{m.id}</small>
                      </td>
                      <td>{m.context?.toLocaleString()}</td>
                      <td>{money(m.input)}</td>
                      <td>{money(m.output)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Code
              text={JSON.stringify(data.data ?? { error: data.error }, null, 2)}
            />
          ))}
        {show && s.read === 'models' && (
          <p className="helper">
            Provider prices are in USD per million tokens. They are not HoodGate
            execution quotes.
          </p>
        )}
      </section>
      <section className="work-panel">
        <h2>Use it from an agent</h2>
        <Code
          text={`const response = await fetch('/api/live/${s.read}');\nconst { data, at, stale } = await response.json();\nconsole.log({ data, observedAt: at, stale });`}
        />
        <a className="text-link" href="/developers">
          Client and server source →
        </a>
      </section>
      <Dialog open={review} onOpenChange={setReview}>
        <DialogContent className="modal">
          <DialogTitle>Review service request</DialogTitle>
          <DialogDescription>{s.name} · Robinhood Chain</DialogDescription>
          <dl className="details">
            <dt>Resource</dt>
            <dd>{s.path}</dd>
            <dt>Wallet</dt>
            <dd>{wallet.account ? short(wallet.account) : 'Not connected'}</dd>
            <dt>Settlement asset</dt>
            <dd>USDG</dd>
            <dt>Payment quote</dt>
            <dd>—</dd>
          </dl>
          {!wallet.account && (
            <Button className="btn" onClick={onConnect}>
              Connect wallet
            </Button>
          )}
          <Button
            className="btn gold"
            disabled
            title="A configured merchant quote and settlement adapter are required"
          >
            Authorize payment
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
const blank = {
  name: '',
  slug: '',
  description: '',
  url: '',
  recipient: '',
  offers: [{ name: 'API request', path: '/report', price: '0.01' }],
};
export function Builder({
  wallet,
  onConnect,
}: {
  wallet: any;
  onConnect: () => void;
}) {
  const [draft, setDraft] = useState<any>(blank),
    [step, setStep] = useState(0),
    [error, setError] = useState(''),
    [saved, setSaved] = useState<any[]>([]),
    [notice, setNotice] = useState('');
  useEffect(() => {
    try {
      const rows = JSON.parse(
        localStorage.getItem('hoodgate.merchants.v1') || '[]',
      );
      if (Array.isArray(rows))
        // Hydrate saved configurations from browser-owned storage.
        // oxlint-disable-next-line react/react-compiler
        setSaved(
          rows.filter(
            (x) =>
              x &&
              typeof x.name === 'string' &&
              typeof x.slug === 'string' &&
              Array.isArray(x.offers),
          ),
        );
    } catch {}
  }, []);
  function update(k: string, v: any) {
    setDraft((d: any) => ({ ...d, [k]: v }));
    setError('');
  }
  function next() {
    if (step === 0 && (!draft.name.trim() || !draft.slug)) {
      setError('Add a name and a unique slug.');
      return;
    }
    if (step === 1) {
      const issue = validateMerchant(draft);
      if (issue) {
        setError(issue);
        return;
      }
    }
    setStep((x) => Math.min(2, x + 1));
    setError('');
  }
  function save() {
    const issue = validateMerchant(draft);
    if (issue) {
      setError(issue);
      return;
    }
    const all = [
      { ...draft, id: draft.slug, updatedAt: Date.now() },
      ...saved.filter((s) => s.slug !== draft.slug),
    ];
    try {
      localStorage.setItem('hoodgate.merchants.v1', JSON.stringify(all));
      setSaved(all);
      setNotice('Configuration saved on this device.');
    } catch {
      setError('Storage is unavailable. Export the manifest instead.');
    }
  }
  return (
    <>
      <PageHeading
        tag="BUILDER / MERCHANT WORKSPACE"
        title="Build something agents can use."
      >
        One service. Clear offers. A destination you control.
      </PageHeading>
      <div className="builder-grid">
        <section className="work-panel">
          <div className="step-tabs">
            {['Service', 'Offers', 'Review'].map((s, i) => (
              <span className={step === i ? 'active' : ''} key={s}>
                {i + 1} / {s}
              </span>
            ))}
          </div>
          {step === 0 ? (
            <>
              <label>
                Service name
                <input
                  value={draft.name}
                  maxLength={60}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Your service"
                />
              </label>
              <label>
                Merchant slug
                <input
                  value={draft.slug}
                  onChange={(e) => update('slug', e.target.value.toLowerCase())}
                  placeholder="my-service"
                  maxLength={40}
                />
              </label>
              <label>
                Description
                <textarea
                  maxLength={300}
                  value={draft.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="What does your service provide?"
                />
              </label>
              <label>
                Upstream API URL
                <input
                  value={draft.url}
                  onChange={(e) => update('url', e.target.value)}
                  placeholder="https://your-service.com"
                />
              </label>
              <label>
                Payout wallet
                <div className="input-row">
                  <input
                    value={draft.recipient}
                    onChange={(e) => update('recipient', e.target.value)}
                    placeholder="0x…"
                  />
                  {wallet.account ? (
                    <Button
                      className="btn"
                      onClick={() => update('recipient', wallet.account)}
                    >
                      Use mine
                    </Button>
                  ) : (
                    <Button className="btn" onClick={onConnect}>
                      Connect
                    </Button>
                  )}
                </div>
              </label>
            </>
          ) : step === 1 ? (
            <>
              <div className="row">
                <h3>Price your endpoints.</h3>
                <span className="tag">USDG / ROBINHOOD</span>
              </div>
              {draft.offers.map((o: any, i: number) => (
                <div className="offer-form" key={i}>
                  <label>
                    Offer name
                    <input
                      value={o.name}
                      onChange={(e) =>
                        update(
                          'offers',
                          draft.offers.map((x: any, j: number) =>
                            j === i ? { ...x, name: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </label>
                  <div className="two-grid">
                    <label>
                      GET path
                      <input
                        value={o.path}
                        onChange={(e) =>
                          update(
                            'offers',
                            draft.offers.map((x: any, j: number) =>
                              j === i ? { ...x, path: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </label>
                    <label>
                      USDG / request
                      <input
                        inputMode="decimal"
                        value={o.price}
                        onChange={(e) =>
                          update(
                            'offers',
                            draft.offers.map((x: any, j: number) =>
                              j === i ? { ...x, price: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </label>
                  </div>
                  {draft.offers.length > 1 && (
                    <button
                      className="text-link"
                      onClick={() =>
                        update(
                          'offers',
                          draft.offers.filter((_: any, j: number) => j !== i),
                        )
                      }
                    >
                      Remove offer
                    </button>
                  )}
                </div>
              ))}
              <Button
                className="btn"
                disabled={draft.offers.length >= 10}
                onClick={() =>
                  update('offers', [
                    ...draft.offers,
                    {
                      name: '',
                      path: '/endpoint-' + (draft.offers.length + 1),
                      price: '0.01',
                    },
                  ])
                }
              >
                + Add an offer
              </Button>
            </>
          ) : (
            <>
              <h2>{draft.name}</h2>
              <dl className="details">
                <dt>Service</dt>
                <dd>{draft.url}</dd>
                <dt>Recipient</dt>
                <dd>{short(draft.recipient)}</dd>
                <dt>Network</dt>
                <dd>Robinhood Chain · 4663</dd>
                <dt>Offers</dt>
                <dd>{draft.offers.length}</dd>
              </dl>
              <Code text={JSON.stringify(merchantSpec(draft), null, 2)} />
              <div className="actions left">
                <Button className="btn" onClick={save}>
                  Save configuration
                </Button>
                <Button
                  className="btn"
                  onClick={() =>
                    download(draft.slug + '-openapi.json', merchantSpec(draft))
                  }
                >
                  Export OpenAPI
                </Button>
              </div>
              <Button
                className="btn gold full"
                disabled
                title="Merchant publication requires the settlement service"
              >
                Publish merchant →
              </Button>
            </>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {notice && <p className="source">{notice}</p>}
          <div className="actions spread">
            {step > 0 && (
              <Button className="btn" onClick={() => setStep((s) => s - 1)}>
                ← Back
              </Button>
            )}
            {step < 2 && (
              <Button className="btn gold" onClick={next}>
                Continue →
              </Button>
            )}
          </div>
        </section>
        <aside>
          <section className="work-panel merchant-preview">
            <span className="service-icon">
              {draft.name?.slice(0, 1) || '◇'}
            </span>
            <h2>{draft.name || 'Your merchant'}</h2>
            <p>
              {draft.description ||
                'Your service, packaged for the machine economy.'}
            </p>
            <span className="tag">ROBINHOOD CHAIN</span>
            <div className="preview-offers">
              {draft.offers.map((o: any, i: number) => (
                <div className="row" key={i}>
                  <span>{o.name || 'New offer'}</span>
                  <strong>{o.price || '—'} USDG</strong>
                </div>
              ))}
            </div>
          </section>
          <section className="work-panel">
            <h3>Your configurations</h3>
            {saved.length ? (
              saved.map((s) => (
                <button
                  className="saved-row"
                  key={s.slug}
                  onClick={() => {
                    setDraft(s);
                    setStep(0);
                    setError('');
                  }}
                >
                  {s.name}
                  <span>{s.offers.length} offers ↗</span>
                </button>
              ))
            ) : (
              <p>Saved service definitions will appear here.</p>
            )}
            <small className="helper">Saved locally in this browser.</small>
          </section>
        </aside>
      </div>
    </>
  );
}
export function Registry({ detail }: { detail?: string }) {
  const result = useLive('agents');
  const [query, setQuery] = useState(''),
    [filter, setFilter] = useState('All agents');
  const all = result.data || [];
  const filtered = all.filter(
    (a: any) =>
      (!detail || String(a.id) === detail) &&
      (filter !== 'With profiles' || a.metadataAvailable) &&
      [a.name, a.description, a.id, a.owner, ...(a.tags || [])]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      {detail ? (
        <a className="text-link" href="/agents">
          ← All identities
        </a>
      ) : null}
      <div className="directory-intro agents-intro">
        <div>
          <p className="eyebrow">THE IDENTITY NETWORK / 02</p>
          <h1>
            {detail ? (
              'Meet the agent.'
            ) : (
              <>
                Intelligence.
                <br />
                <i>With an identity.</i>
              </>
            )}
          </h1>
          <p>
            Meet the agents building on Robinhood Chain.
            <br />
            Explore their published profiles, capabilities and owners.
          </p>
          <div className="directory-facts">
            <span>
              <strong>{all.length || '—'}</strong> identities shown
            </span>
            <span>
              <strong>
                {all.filter((a: any) => a.metadataAvailable).length || '—'}
              </strong>{' '}
              public profiles
            </span>
            <span>ERC-8004</span>
          </div>
        </div>
        <div className="directory-art agent-radar" aria-hidden="true">
          <Art kind="agent" />
          <span>IDENTITY / CAPABILITY / CONNECTION</span>
        </div>
      </div>
      <div className="filter-bar">
        <div className="tabs">
          {['All agents', 'With profiles'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'active' : ''}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          aria-label="Search agents"
          placeholder="Search names, capabilities or owners…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Source data={result} name="Robinhood registry + publisher metadata" />
      <div className={'agent-directory ' + (detail ? 'agent-detail-grid' : '')}>
        {filtered.map((a: any) => (
          <article className="agent-card" key={a.id}>
            <AgentPortrait id={String(a.id)} name={a.name} image={a.image} />
            <div className="agent-card-body">
              <div className="agent-caption">
                <span>ERC-8004</span>
                <span>
                  {a.metadataAvailable
                    ? 'PUBLISHED PROFILE'
                    : 'ON-CHAIN IDENTITY'}
                </span>
              </div>
              <a href={'/agents/' + a.id}>
                <h2>{a.name}</h2>
              </a>
              <p>
                {a.description ||
                  'A registered agent identity. Its owner has not published a public description.'}
              </p>
              <div className="capability-tags">
                {(a.tags || []).slice(0, 3).map((tag: string) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="agent-owner">
                <span>OWNER</span>
                <a
                  href={
                    'https://robinhoodchain.blockscout.com/address/' + a.owner
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {short(a.owner)} ↗
                </a>
              </div>
              <div className="agent-actions">
                {a.website ? (
                  <a href={a.website} target="_blank" rel="noopener noreferrer">
                    Open project ↗
                  </a>
                ) : (
                  <a href={'/agents/' + a.id}>View identity ↗</a>
                )}
                {a.metadataUri ? (
                  <a
                    href={a.metadataUri}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Metadata
                  </a>
                ) : null}
                <a
                  href={
                    'https://robinhoodchain.blockscout.com/token/' +
                    REGISTRY +
                    '/instance/' +
                    a.id
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Explorer ↗
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!result.loading && !filtered.length ? (
        <div className="empty">
          No matching agents. Try a different name or capability.
        </div>
      ) : null}
      <p className="registry-note">
        Profiles are published by their owners in the shared Robinhood Chain
        registry. Names and descriptions are self-reported; registration is not
        an endorsement by HoodGate.
      </p>
      <a className="btn" href="/dashboard">
        Prepare a service identity →
      </a>
    </>
  );
}
export function Network({ scan = false }: { scan?: boolean }) {
  const result = useLive('network'),
    n = result.data;
  return (
    <>
      <PageHeading
        tag="HOODSCAN / ROBINHOOD CHAIN"
        title={scan ? 'Follow the chain.' : 'Network status'}
      >
        Live network observations and recent transactions. Activity shown here
        is chain-wide and is not attributed to HoodGate.
      </PageHeading>
      <Source data={result} name="Robinhood RPC + Blockscout" />
      <div className="stat-grid">
        <div>
          <small>LATEST BLOCK</small>
          <strong>{n?.block ? Number(n.block).toLocaleString() : '—'}</strong>
        </div>
        <div>
          <small>GAS / GWEI</small>
          <strong>{n?.gasGwei != null ? n.gasGwei.toFixed(5) : '—'}</strong>
        </div>
        <div>
          <small>TOTAL TRANSACTIONS</small>
          <strong>
            {n?.stats?.total_transactions
              ? Number(n.stats.total_transactions).toLocaleString()
              : '—'}
          </strong>
        </div>
      </div>
      <h2>Recent transactions</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Transaction</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {n?.transactions?.map((t: any) => (
              <tr key={t.hash}>
                <td>{new Date(t.timestamp).toLocaleTimeString()}</td>
                <td>
                  <a
                    className="text-link"
                    target="_blank"
                    rel="noreferrer"
                    href={'https://robinhoodchain.blockscout.com/tx/' + t.hash}
                  >
                    {short(t.hash)} ↗
                  </a>
                </td>
                <td>{short(t.from)}</td>
                <td>{short(t.to)}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {n && !n.transactions.length && (
        <p className="empty">Transaction feed has not returned records.</p>
      )}
    </>
  );
}
