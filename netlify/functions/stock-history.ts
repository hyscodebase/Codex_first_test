import { alphaVantageKey, badRequest, json, upstreamError, toUnix } from './_utils';

const normalizeInterval = (interval: string) => {
  if (interval === 'daily') return { fn: 'TIME_SERIES_DAILY_ADJUSTED', key: 'Time Series (Daily)', queryInterval: '' };
  return { fn: 'TIME_SERIES_INTRADAY', key: `Time Series (${interval})`, queryInterval: `&interval=${interval}` };
};

export default async (request: Request) => {
  const url = new URL(request.url);
  const ticker = url.searchParams.get('ticker')?.toUpperCase();
  const interval = url.searchParams.get('interval') ?? 'daily';
  if (!ticker) return badRequest('ticker is required');

  const apiKey = alphaVantageKey();
  if (!apiKey) {
    return json(400, { error: 'ALPHAVANTAGE_API_KEY is missing. 주식 데이터는 키가 필요합니다.', code: 'ALPHAVANTAGE_KEY_REQUIRED' });
  }

  const cfg = normalizeInterval(interval);
  const endpoint = `https://www.alphavantage.co/query?function=${cfg.fn}&symbol=${encodeURIComponent(ticker)}${cfg.queryInterval}&outputsize=full&apikey=${encodeURIComponent(apiKey)}`;
  const upstream = await fetch(endpoint);
  if (!upstream.ok) return upstreamError('Alpha Vantage history request failed');

  const data = await upstream.json();
  const series = data[cfg.key];
  if (!series) return upstreamError('No stock history found');

  const candles = Object.entries(series)
    .map(([time, value]) => {
      const row = value as Record<string, string>;
      return {
        time: toUnix(time),
        open: Number(row['1. open']),
        high: Number(row['2. high']),
        low: Number(row['3. low']),
        close: Number(row['4. close']),
        volume: Number(row['6. volume'] ?? row['5. volume'] ?? 0)
      };
    })
    .sort((a, b) => a.time - b.time)
    .slice(-500);

  return json(200, { symbol: ticker, candles });
};
