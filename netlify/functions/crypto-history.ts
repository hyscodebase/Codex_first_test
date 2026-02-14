import { badRequest, coingeckoKey, json, upstreamError } from './_utils';

export default async (request: Request) => {
  const url = new URL(request.url);
  const coinId = url.searchParams.get('coin_id');
  const vsCurrency = (url.searchParams.get('vs_currency') ?? 'usd').toLowerCase();
  const days = url.searchParams.get('days') ?? '30';
  if (!coinId) return badRequest('coin_id is required');

  const key = coingeckoKey();
  const headers = key ? { 'x-cg-demo-api-key': key } : {};

  const upstream = await fetch(
    `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coinId)}/ohlc?vs_currency=${encodeURIComponent(vsCurrency)}&days=${encodeURIComponent(days)}`,
    { headers }
  );

  if (!upstream.ok) {
    const fallback = key
      ? 'CoinGecko history request failed.'
      : 'COINGECKO_API_KEY 없이 제한에 걸렸습니다. 키 설정이 필요할 수 있습니다.';
    return upstreamError(fallback);
  }

  const rows = (await upstream.json()) as [number, number, number, number, number][];
  const candles = rows.map(([timeMs, open, high, low, close]) => ({
    time: Math.floor(timeMs / 1000),
    open,
    high,
    low,
    close,
    volume: 0
  }));

  return json(200, { symbol: coinId.toUpperCase(), candles });
};
