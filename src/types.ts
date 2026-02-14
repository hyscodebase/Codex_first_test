export type AssetType = 'stock' | 'crypto';

export type Interval = '1min' | '5min' | '15min' | '30min' | '60min' | 'daily';

export interface QuoteData {
  symbol: string;
  price: number;
  change?: number;
  changePercent?: number;
  high?: number;
  low?: number;
  volume?: number;
  source: 'alphavantage' | 'coingecko';
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface HistoryData {
  symbol: string;
  candles: Candle[];
}

export interface ApiError {
  error: string;
  code?: string;
}

export interface WatchItem {
  type: AssetType;
  id: string;
}
