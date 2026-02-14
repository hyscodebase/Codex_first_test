# Stock + Crypto Dashboard (Vite + React + Netlify Functions)

## Quick start

```bash
npm install
npm run dev
```

### Netlify local dev (with Functions)

```bash
npm install -g netlify-cli
netlify dev
```

## Env vars

- `COINGECKO_API_KEY` (optional but recommended)
- `ALPHAVANTAGE_API_KEY` (required for stock endpoints)

## Netlify deploy

1. Push this repo to GitHub.
2. In Netlify, create a new site from Git.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Functions directory: `netlify/functions`
6. Set environment variables:
   - `COINGECKO_API_KEY`
   - `ALPHAVANTAGE_API_KEY`

## Future ideas

- Price alerts and notification channels (email/slack/web push)
- Portfolio tracker and PnL analytics
- News API function with sentiment
- Polling optimization and websocket streaming
