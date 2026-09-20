# HoodGate

A black-and-gold gateway to machine commerce on Robinhood Chain.

Includes an interactive particle landing page, a curated service directory, live API inspections, a merchant offer builder, wallet connection and real balances, public ERC-8004 registry views, network activity, documentation and lightweight client/server helpers.

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 8986
```

Open http://127.0.0.1:8986.

```sh
npm test
npx tsc --noEmit
npm run build
```

## Routes

`/` · `/marketplace` · `/marketplace/:id` · `/dashboard` · `/agents` · `/agents/:id` · `/wallet` · `/scan` · `/status` · `/ecosystem` · `/earn` · `/leaderboard` · `/claim` · `/token` · `/agent` · `/blog` · `/facilitator` · `/docs` · `/developers`

## Data and wallet boundaries

- EIP-6963 browser wallet discovery; connection and network changes require user action.
- Balances come from the selected wallet provider on chain 4663. USDG decimals are read from the token contract.
- API calls use fixed upstream origins, short timeouts, bounded caching and explicitly marked stale results. No invented fallback prices or transactions.
- AI listings show public model metadata and prices. They do not relay paid inference requests.
- Network statistics and registry records are chain-wide data, not HoodGate revenue or customers.
- Merchant configurations stay in local browser storage and can be exported as OpenAPI JSON.
- Final payment, claim and publication controls are disabled. This release does not sign, broadcast, verify or settle payments. An execution backend and independently validated contracts are required before enabling them.
- The agent page composes a request; it is not an LLM inference service.
- No project token contract, reward distributions or token price is asserted.

## Architecture

- `app/`: React interface and API route handlers (Vinext / Vite).
- `lib/catalog.ts`: service directory, chain constants and builder validation.
- `lib/live.ts`: read-only upstream adapters, cache and timeouts.
- `packages/client`: small read-only HTTP client.
- `packages/server`: validated payment requirement configuration helper; not a facilitator.
- `public/openapi.json`: read-only API specification.

## Sources

[Robinhood Chain](https://docs.robinhood.com/chain/) · [Blockscout](https://robinhoodchain.blockscout.com/) · [OpenRouter](https://openrouter.ai/docs/quickstart) · [DEX Screener](https://docs.dexscreener.com/api/reference) · [Kraken](https://docs.kraken.com/api/) · [Open-Meteo](https://open-meteo.com/) · [DefiLlama](https://api-docs.defillama.com/) · [Hacker News Search](https://hn.algolia.com/api) · [Wikimedia](https://www.mediawiki.org/wiki/API:Main_page) · [GitHub](https://docs.github.com/en/rest)

Public providers impose rate limits and may change availability. Production operators should review upstream terms and monitor errors.

Independent project. Not affiliated with Robinhood, MeshGateway or listed service providers. No private keys or API secrets are required for the included read-only features.

## Contract and social settings

See [FAST-CONTRACT-UPDATE.md](FAST-CONTRACT-UPDATE.md). The header and Token page read `public/token.json` every five seconds while visible. The project contract and official X URL are initially empty.

## Directory identities

Provider logos in `public/logos` are locally stored favicons retrieved from the providers’ domains through Google’s favicon service. They identify listed integrations and do not imply endorsement. The generated gold gateway is also used as HoodGate’s brand mark and favicon. Agent names, descriptions and artwork come from publisher metadata linked to ERC-8004 records. Missing metadata stays explicitly unnamed; profiles are not verification or endorsement. Server-side metadata retrieval only accepts the known HTTPS hosts listed in `lib/agent-metadata.ts`, rejects redirects and limits time and response size.
