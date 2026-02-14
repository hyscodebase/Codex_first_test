export const json = (statusCode: number, body: unknown, cacheSeconds = 30) =>
  new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`
    }
  });

export const badRequest = (message: string) => json(400, { error: message });
export const upstreamError = (message: string) => json(502, { error: message });

export const alphaVantageKey = () => process.env.ALPHAVANTAGE_API_KEY;
export const coingeckoKey = () => process.env.COINGECKO_API_KEY;

export const toUnix = (dateText: string) => Math.floor(new Date(dateText).getTime() / 1000);
