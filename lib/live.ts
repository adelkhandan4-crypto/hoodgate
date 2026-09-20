import { REGISTRY } from './catalog';
const cache = new Map<string, { at: number; data: any }>(),
  pending = new Map<string, Promise<any>>();
async function json(url: string, init?: RequestInit): Promise<any> {
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');
  headers.set(
    'User-Agent',
    'HoodGate/0.1 (public API client; https://github.com/adelkhandan4-crypto/hoodgate)',
  );
  const r = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(12000),
    headers,
  });
  if (!r.ok) throw Error('Provider returned HTTP ' + r.status);
  return r.json();
}
async function rpc(method: string, params: any[] = []) {
  const r = await json('https://rpc.mainnet.chain.robinhood.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (r.error) throw Error('Network RPC unavailable');
  return r.result;
}
const explorer = 'https://robinhoodchain.blockscout.com/api/v2';
async function retrieve(kind: string, q: string) {
  switch (kind) {
    case 'network': {
      const results = await Promise.allSettled([
        rpc('eth_chainId'),
        rpc('eth_blockNumber'),
        rpc('eth_gasPrice'),
        json(explorer + '/stats'),
        json(explorer + '/transactions'),
      ]);
      const get = (i: number) =>
        results[i].status === 'fulfilled'
          ? (results[i] as PromiseFulfilledResult<any>).value
          : null;
      if (get(0) && get(0) !== '0x1237') throw Error('Chain identity mismatch');
      if (!get(1) && !get(3)) throw Error('Network data unavailable');
      let rpcTransactions: any[] = [];
      if (!get(4) && get(1)) {
        const block = parseInt(get(1), 16);
        const blocks = await Promise.allSettled(
          [0, 1, 2].map((n) =>
            rpc('eth_getBlockByNumber', [
              '0x' + (block - n).toString(16),
              true,
            ]),
          ),
        );
        rpcTransactions = blocks
          .flatMap((b) =>
            b.status === 'fulfilled'
              ? (b.value?.transactions || []).map((t: any) => ({
                  hash: t.hash,
                  from: t.from,
                  to: t.to,
                  timestamp: new Date(
                    parseInt(b.value.timestamp, 16) * 1000,
                  ).toISOString(),
                  status: 'Included in block',
                  value: t.value,
                  method: t.input === '0x' ? 'Transfer' : 'Contract call',
                }))
              : [],
          )
          .slice(0, 15);
      }
      return {
        chainId: 4663,
        block: get(1) ? parseInt(get(1), 16) : get(3)?.total_blocks,
        gasGwei: get(2) ? Number(BigInt(get(2))) / 1e9 : null,
        stats: get(3),
        transactions: get(4)
          ? (get(4)?.items || []).slice(0, 15).map((t: any) => ({
              hash: t.hash,
              from: t.from?.hash,
              to: t.to?.hash,
              timestamp: t.timestamp,
              status: t.status,
              value: t.value,
              method: t.method,
            }))
          : rpcTransactions,
      };
    }
    case 'models': {
      const r = await json('https://openrouter.ai/api/v1/models');
      return r.data.map((m: any) => ({
        id: m.id,
        name: m.name,
        context: m.context_length,
        input: Number(m.pricing?.prompt) * 1e6,
        output: Number(m.pricing?.completion) * 1e6,
        modalities: m.architecture?.output_modalities || [],
      }));
    }
    case 'markets': {
      const r = await json(
        'https://api.dexscreener.com/latest/dex/search?q=robinhood',
      );
      return (r.pairs || [])
        .filter((p: any) => p.chainId === 'robinhood')
        .slice(0, 24)
        .map((p: any) => ({
          name: p.baseToken.name,
          symbol: p.baseToken.symbol,
          address: p.baseToken.address,
          price: Number(p.priceUsd),
          change: p.priceChange?.h24,
          volume: p.volume?.h24,
          liquidity: p.liquidity?.usd,
          url: p.url,
        }));
    }
    case 'agents': {
      try {
        const r = await json(explorer + '/tokens/' + REGISTRY + '/instances');
        return (r.items || []).slice(0, 40).map((a: any) => ({
          id: a.id,
          name: a.metadata?.name || 'Agent #' + a.id,
          description: a.metadata?.description || '',
          owner: a.owner?.hash || '',
          image: a.image_url,
          registry: REGISTRY,
        }));
      } catch {
        const ids = Array.from({ length: 24 }, (_, i) => i + 1);
        const batch = ids.flatMap((id) => [
          {
            jsonrpc: '2.0',
            id: id * 2,
            method: 'eth_call',
            params: [
              {
                to: REGISTRY,
                data: '0x6352211e' + id.toString(16).padStart(64, '0'),
              },
              'latest',
            ],
          },
          {
            jsonrpc: '2.0',
            id: id * 2 + 1,
            method: 'eth_call',
            params: [
              {
                to: REGISTRY,
                data: '0xc87b56dd' + id.toString(16).padStart(64, '0'),
              },
              'latest',
            ],
          },
        ]);
        const response = await json('https://rpc.mainnet.chain.robinhood.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batch),
        });
        if (!Array.isArray(response)) throw Error('Registry RPC unavailable');
        const byId = new Map(response.map((r: any) => [r.id, r.result]));
        return ids.flatMap((id) => {
          const owner = byId.get(id * 2) as string | undefined;
          if (!owner || owner.length !== 66) return [];
          return [
            {
              id: String(id),
              name: 'Agent #' + id,
              description:
                'Public ERC-8004 identity - read directly from the registry',
              owner: '0x' + owner.slice(-40),
              registry: REGISTRY,
            },
          ];
        });
      }
    }

    case 'kraken':
      return (
        await json('https://api.kraken.com/0/public/Ticker?pair=XBTUSD,ETHUSD')
      ).result;
    case 'weather':
      return json(
        'https://api.open-meteo.com/v1/forecast?latitude=51.51&longitude=-0.13&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=3',
      );
    case 'defi':
      return (await json('https://api.llama.fi/v2/chains'))
        .sort((a: any, b: any) => b.tvl - a.tvl)
        .slice(0, 20);
    case 'search': {
      const r = await json(
        'https://hn.algolia.com/api/v1/search?query=' +
          encodeURIComponent(q || 'Robinhood') +
          '&hitsPerPage=10',
      );
      return r.hits.map((h: any) => ({
        title: h.title,
        url: h.url,
        points: h.points,
        createdAt: h.created_at,
      }));
    }
    case 'wiki': {
      const r = await json(
        'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' +
          encodeURIComponent(q || 'Artificial intelligence') +
          '&format=json',
      );
      return r.query.search.map((x: any) => ({
        title: x.title,
        pageId: x.pageid,
        words: x.wordcount,
      }));
    }
    case 'commons': {
      const r = await json(
        'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' +
          encodeURIComponent(q || 'gold') +
          '&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json',
      );
      return Object.values(r.query?.pages || {}).map((p: any) => ({
        title: p.title,
        image: p.imageinfo?.[0]?.thumburl,
        source: p.imageinfo?.[0]?.descriptionurl,
      }));
    }
    case 'github': {
      const r = await json(
        'https://api.github.com/search/repositories?q=' +
          encodeURIComponent((q || 'x402') + ' archived:false') +
          '&sort=stars&per_page=8',
      );
      return r.items.map((r: any) => ({
        name: r.full_name,
        description: r.description,
        stars: r.stargazers_count,
        language: r.language,
        url: r.html_url,
      }));
    }
    default:
      throw Error('Unknown data source');
  }
}
export async function live(kind: string, q = '') {
  const key = kind + ':' + q,
    old = cache.get(key),
    ttl = kind === 'network' ? 20000 : kind === 'models' ? 300000 : 60000;
  if (old && Date.now() - old.at < ttl) return { ...old, stale: false };
  if (pending.has(key)) return pending.get(key);
  const task = retrieve(kind, q)
    .then((data) => {
      const entry = { at: Date.now(), data };
      if (cache.size >= 256) cache.delete(cache.keys().next().value!);
      cache.set(key, entry);
      return { ...entry, stale: false };
    })
    .catch((e) => {
      if (old) return { ...old, stale: true, error: e.message };
      throw e;
    })
    .finally(() => pending.delete(key));
  pending.set(key, task);
  return task;
}
