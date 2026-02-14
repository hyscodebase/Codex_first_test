import type { HistoryData, QuoteData } from '../types';

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  const body = await response.json();

  if (!response.ok) {
    const errorMessage = body?.error ?? 'Unknown API error';
    throw new Error(errorMessage);
  }

  return body as T;
};

export const getStockQuote = (ticker: string) =>
  fetchJson<QuoteData>(`/api/stock/quote?ticker=${encodeURIComponent(ticker)}`);

export const getStockHistory = (ticker: string, range: string, interval: string) =>
  fetchJson<HistoryData>(
    `/api/stock/history?ticker=${encodeURIComponent(ticker)}&range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`
  );

export const getCryptoQuote = (coinId: string, vsCurrency: string) =>
  fetchJson<QuoteData>(
    `/api/crypto/quote?coin_id=${encodeURIComponent(coinId)}&vs_currency=${encodeURIComponent(vsCurrency)}`
  );

export const getCryptoHistory = (coinId: string, vsCurrency: string, days: string) =>
  fetchJson<HistoryData>(
    `/api/crypto/history?coin_id=${encodeURIComponent(coinId)}&vs_currency=${encodeURIComponent(vsCurrency)}&days=${encodeURIComponent(days)}`
  );
