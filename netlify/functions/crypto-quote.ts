import { badRequest, coingeckoKey, json, upstreamError } from './_utils';

export default async (request: Request) => {
  const url = new URL(request.url);
  const coinId = url.searchParams.get('coin_id');
  const vsCurrency = (url.searchParams.get('vs_currency') ?? 'usd').toLowerCase();
  if (!coinId) return badRequest('coin_id is required');

  const key = coingeckoKey();
  const headers = key ? { 'x-cg-demo-api-key': key } : {};

  const upstream = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${encodeURIComponent(vsCurrency)}&ids=${encodeURIComponent(coinId)}`,
    { headers }
  );

  if (!upstream.ok) {
    const fallback = key
      ? 'CoinGecko quote request failed.'
      : 'COINGECKO_API_KEY 없이 제한에 걸렸습니다. 키 설정이 필요할 수 있습니다.';
    return upstreamError(fallback);
  }

  const data = (await upstream.json()) as Array<Record<string, unknown>>;
  const row = data[0];
  if (!row) return upstreamError('No coin quote found');

  return json(200, {
    symbol: String(row.symbol ?? coinId).toUpperCase(),
    price: Number(row.current_price ?? 0),
    changePercent: Number(row.price_change_percentage_24h ?? 0),
    high: Number(row.high_24h ?? 0),
    low: Number(row.low_24h ?? 0),
    volume: Number(row.total_volume ?? 0),
    source: 'coingecko'
  });
};
