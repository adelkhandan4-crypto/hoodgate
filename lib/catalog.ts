export const CHAIN = {
  chainId: '0x1237',
  chainName: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://rpc.mainnet.chain.robinhood.com'],
  blockExplorerUrls: ['https://robinhoodchain.blockscout.com'],
};
export const USDG = '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168';
export const REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432';
export const categories = [
  'AI Models',
  'Media',
  'Search',
  'Web & Scraping',
  'Data',
  'Blockchain',
];
export const services = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    category: 'AI Models',
    icon: '↗',
    description:
      'Explore a live catalog of language models, context windows and published token pricing.',
    source: 'https://openrouter.ai',
    read: 'models',
    path: '/models',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    category: 'AI Models',
    icon: 'A',
    description:
      'Claude model discovery, context limits and current provider pricing from the public model catalog.',
    source: 'https://www.anthropic.com',
    read: 'models',
    provider: 'anthropic/',
    path: '/models',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    category: 'AI Models',
    icon: '◎',
    description:
      'Discover available OpenAI models and compare published input and output token prices.',
    source: 'https://openai.com',
    read: 'models',
    provider: 'openai/',
    path: '/models',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'AI Models',
    icon: '✦',
    description:
      'Multimodal model discovery with published context sizes and modality information.',
    source: 'https://ai.google.dev',
    read: 'models',
    provider: 'google/',
    path: '/models',
  },
  {
    id: 'grok',
    name: 'Grok',
    category: 'AI Models',
    icon: '𝕏',
    description:
      'Explore xAI model metadata and provider-published inference prices.',
    source: 'https://x.ai',
    read: 'models',
    provider: 'x-ai/',
    path: '/models',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    category: 'AI Models',
    icon: '≈',
    description:
      'Reasoning and chat model discovery from live public model records.',
    source: 'https://www.deepseek.com',
    read: 'models',
    provider: 'deepseek/',
    path: '/models',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    category: 'AI Models',
    icon: 'M',
    description:
      'Browse Mistral models, their context windows and current public pricing.',
    source: 'https://mistral.ai',
    read: 'models',
    provider: 'mistralai/',
    path: '/models',
  },
  {
    id: 'meta',
    name: 'Llama',
    category: 'AI Models',
    icon: '∞',
    description:
      'Open-weight model discovery with independent hosting provider price information.',
    source: 'https://www.llama.com',
    read: 'models',
    provider: 'meta-llama/',
    path: '/models',
  },
  {
    id: 'hood-markets',
    name: 'Hood Markets',
    category: 'Blockchain',
    icon: '◈',
    description:
      'Robinhood Chain token pools: current prices, liquidity, market activity and trading pairs.',
    source: 'https://dexscreener.com/robinhood',
    read: 'markets',
    path: '/tokens',
  },
  {
    id: 'hood-scan',
    name: 'HoodScan',
    category: 'Blockchain',
    icon: '▦',
    description:
      'Read the latest Robinhood blocks, transactions and network statistics from Blockscout.',
    source: 'https://robinhoodchain.blockscout.com',
    read: 'network',
    path: '/network',
  },
  {
    id: 'hood-identity',
    name: 'HoodIdentity',
    category: 'Blockchain',
    icon: '⌘',
    description:
      'Explore public ERC-8004 identities registered on Robinhood Chain.',
    source: 'https://robinhoodchain.blockscout.com',
    read: 'agents',
    path: '/agents',
  },
  {
    id: 'kraken',
    name: 'Kraken Markets',
    category: 'Data',
    icon: '∩',
    description:
      'Current Bitcoin and Ether market quotes directly from the Kraken public market API.',
    source: 'https://www.kraken.com',
    read: 'kraken',
    path: '/ticker',
  },
  {
    id: 'open-meteo',
    name: 'Open-Meteo',
    category: 'Data',
    icon: '☼',
    description:
      'Current weather observations and daily forecasts with no API key required.',
    source: 'https://open-meteo.com',
    read: 'weather',
    path: '/weather',
  },
  {
    id: 'defillama',
    name: 'DeFiLlama',
    category: 'Data',
    icon: 'Λ',
    description:
      'Chain-level total value locked from a public DeFi analytics source.',
    source: 'https://defillama.com',
    read: 'defi',
    path: '/chains',
  },
  {
    id: 'hacker-news',
    name: 'Hacker News Search',
    category: 'Search',
    icon: 'Y',
    description:
      'Search public technology discussions using the Algolia Hacker News API.',
    source: 'https://hn.algolia.com',
    read: 'search',
    path: '/search',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    category: 'Search',
    icon: 'W',
    description:
      'Search the English encyclopedia and retrieve article descriptions.',
    source: 'https://en.wikipedia.org',
    read: 'wiki',
    path: '/search',
  },
  {
    id: 'commons',
    name: 'Wikimedia Commons',
    category: 'Media',
    icon: '◉',
    description:
      'Discover openly indexed photographs and illustrations with source attribution.',
    source: 'https://commons.wikimedia.org',
    read: 'commons',
    path: '/images',
  },
  {
    id: 'github',
    name: 'GitHub Repository API',
    category: 'Web & Scraping',
    icon: '⌥',
    description:
      'Read public repository metadata: descriptions, languages and repository links.',
    source: 'https://github.com',
    read: 'github',
    path: '/repositories',
  },
];
export type Service = (typeof services)[number];
export function validAddress(a: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(a);
}
export function publicURL(value: string) {
  try {
    const u = new URL(value);
    const h = u.hostname.toLowerCase();
    return (
      u.protocol === 'https:' &&
      !u.username &&
      !u.password &&
      !h.includes(':') &&
      !/^\d/.test(h) &&
      !h.endsWith('.local') &&
      !h.endsWith('.internal') &&
      h.includes('.') &&
      !h.includes('localhost')
    );
  } catch {
    return false;
  }
}
export function validateMerchant(m: any) {
  if (!m.name?.trim() || m.name.length > 60)
    return 'Enter a service name, up to 60 characters.';
  if (!/^[a-z][a-z0-9-]{2,39}$/.test(m.slug || ''))
    return 'Use a slug of 3–40 lowercase letters, numbers and hyphens.';
  if (!publicURL(m.url))
    return 'Use a public HTTPS service URL without credentials.';
  if (!validAddress(m.recipient)) return 'Enter a complete EVM payout address.';
  if (!m.offers?.length || m.offers.length > 10) return 'Add 1–10 offers.';
  for (const o of m.offers) {
    if (
      !o.name?.trim() ||
      !/^\/[a-zA-Z0-9_/-]*$/.test(o.path) ||
      !Number.isFinite(Number(o.price)) ||
      Number(o.price) <= 0 ||
      Number(o.price) > 10000 ||
      !/^(\d+)(\.\d{1,6})?$/.test(String(o.price))
    )
      return 'Each offer needs a name, endpoint path and positive price with at most six decimals.';
  }
  if (new Set(m.offers.map((o: any) => o.path)).size !== m.offers.length)
    return 'Offer paths must be unique.';
  return '';
}
export function merchantSpec(m: any) {
  const error = validateMerchant(m);
  if (error) throw Error(error);
  return {
    openapi: '3.1.0',
    info: { title: m.name, version: '1.0.0', description: m.description },
    servers: [{ url: m.url }],
    paths: Object.fromEntries(
      m.offers.map((o: any) => [
        o.path,
        {
          get: {
            summary: o.name,
            'x-payment-info': {
              network: 'eip155:4663',
              asset: USDG,
              amount: String(o.price),
              recipient: m.recipient,
            },
            responses: {
              '200': { description: 'Service response' },
              '402': { description: 'Payment required' },
            },
          },
        },
      ]),
    ),
  };
}
