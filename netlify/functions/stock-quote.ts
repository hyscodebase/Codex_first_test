import { alphaVantageKey, badRequest, json, upstreamError } from './_utils';

export default async (request: Request) => {
  const url = new URL(request.url);
  const ticker = url.searchParams.get('ticker')?.toUpperCase();
  if (!ticker) return badRequest('ticker is required');

  const apiKey = alphaVantageKey();
  if (!apiKey) {
    return json(400, { error: 'ALPHAVANTAGE_API_KEY is missing. 주식 데이터는 키가 필요합니다.', code: 'ALPHAVANTAGE_KEY_REQUIRED' });
  }

  const upstream = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ticker)}&apikey=${encodeURIComponent(apiKey)}`
  );

  if (!upstream.ok) return upstreamError('Alpha Vantage request failed');

  const data = await upstream.json();
  const quote = data['Global Quote'];
  if (!quote || !quote['05. price']) return upstreamError('No stock quote found for ticker');

  return json(200, {
    symbol: ticker,
    price: Number(quote['05. price']),
    change: Number(quote['09. change'] ?? 0),
    changePercent: Number(String(quote['10. change percent'] ?? '0').replace('%', '')),
    high: Number(quote['03. high'] ?? 0),
    low: Number(quote['04. low'] ?? 0),
    volume: Number(quote['06. volume'] ?? 0),
    source: 'alphavantage'
  });
};
