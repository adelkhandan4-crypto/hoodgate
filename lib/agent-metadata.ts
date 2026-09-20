// Only known public metadata hosts are fetched. Registry values never become
// arbitrary server-side URLs; redirects, credentials and non-standard ports are rejected.
const metadataHosts = new Set([
  'a-identity.xyz',
  'sai-agent-server.vercel.app',
  'tasklane.org',
  'api.meshgateway.co',
  'metadata.evoevo.ai',
  'signalbound.art',
  'oddysey.dev',
]);
export function decodeTokenURI(hex: string) {
  if (
    !/^0x[0-9a-fA-F]+$/.test(hex) ||
    hex.length > 20000 ||
    hex.length % 2 !== 0
  )
    return '';
  try {
    const bytes = Uint8Array.from(hex.slice(2).match(/../g)!, (h) =>
      parseInt(h, 16),
    );
    const offset = Number(BigInt('0x' + hex.slice(2, 66)));
    if (!Number.isSafeInteger(offset) || offset + 32 > bytes.length) return '';
    const size = Number(
      BigInt(
        '0x' +
          Array.from(bytes.slice(offset, offset + 32), (x) =>
            x.toString(16).padStart(2, '0'),
          ).join(''),
      ),
    );
    if (
      !Number.isSafeInteger(size) ||
      size > 8192 ||
      offset + 32 + size > bytes.length
    )
      return '';
    return new TextDecoder().decode(
      bytes.slice(offset + 32, offset + 32 + size),
    );
  } catch {
    return '';
  }
}
export function metadataURL(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' &&
      !u.username &&
      !u.password &&
      !u.port &&
      metadataHosts.has(u.hostname)
      ? u.href
      : '';
  } catch {
    return '';
  }
}
export function publicLink(value: unknown) {
  if (typeof value !== 'string' || value.length > 2048) return '';
  try {
    const u = new URL(value);
    return u.protocol === 'https:' &&
      !u.username &&
      !u.password &&
      !u.port &&
      !/^\d+\./.test(u.hostname) &&
      !u.hostname.includes(':') &&
      u.hostname.includes('.') &&
      !/\.(local|internal|localhost)$/.test(u.hostname)
      ? u.href
      : '';
  } catch {
    return '';
  }
}
const text = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';
export async function enrichAgent<
  T extends {
    id: string;
    name: string;
    description: string;
    metadataUri?: string;
  },
>(agent: T) {
  const url = metadataURL(agent.metadataUri || '');
  if (!url) return agent;
  try {
    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(4500),
      headers: {
        Accept: 'application/json',
        'User-Agent': 'HoodGate/0.1 public-registry-reader',
      },
    });
    if (!response.ok || !response.body) return agent;
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        length += chunk.value.length;
        if (length > 128000) {
          await reader.cancel();
          return agent;
        }
        chunks.push(chunk.value);
      }
    } finally {
      reader.releaseLock();
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const m = JSON.parse(new TextDecoder().decode(bytes));
    const endpoints = Array.isArray(m.services) ? m.services : [];
    const tags = [
      ...(Array.isArray(m.tags) ? m.tags : []),
      ...endpoints.map((s: { name?: string }) => s.name),
    ].filter((s: unknown) => typeof s === 'string' && s.length < 32);
    return {
      ...agent,
      name: text(m.name || m.handle, 100) || agent.name,
      description:
        text(m.description, 700) ||
        'A public agent identity on Robinhood Chain. Its owner has not published a capability description.',
      image: publicLink(m.image || m.iconUrl),
      website: publicLink(
        m.external_url ||
          m.url ||
          endpoints.find((s: { name?: string }) => s.name === 'web')?.endpoint,
      ),
      tags: [...new Set(tags)].slice(0, 4),
      metadataUri: url,
      metadataAvailable: true,
    };
  } catch {
    return agent;
  }
}
