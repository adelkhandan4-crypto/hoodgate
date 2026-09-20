/** Read-only client for a HoodGate instance. No wallet access or automatic payment. */
export async function discover(url, { signal, fetcher = fetch } = {}) {
  const response = await fetcher(url, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Catalog returned HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.services)) throw new Error('Invalid service catalog');
  return data;
}
const sources = new Set([
  'network',
  'models',
  'markets',
  'agents',
  'kraken',
  'weather',
  'defi',
  'search',
  'wiki',
  'commons',
  'github',
]);
export async function readData(
  origin,
  kind,
  { query = '', signal, fetcher = fetch } = {},
) {
  if (!sources.has(kind)) throw new Error('Unsupported source');
  if (query.length > 100) throw new Error('Query is too long');
  const url = new URL(`/api/live/${kind}`, origin);
  if (query) url.searchParams.set('q', query);
  const response = await fetcher(url, {
    signal,
    headers: { Accept: 'application/json' },
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || `Provider returned HTTP ${response.status}`);
  return data;
}
