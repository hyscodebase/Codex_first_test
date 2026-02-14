import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from './components/Sidebar';
import { Watchlist } from './components/Watchlist';
import { KpiCards } from './components/KpiCards';
import { PriceChart } from './components/PriceChart';
import type { AssetType, Interval, QuoteData, WatchItem } from './types';
import { getCryptoHistory, getCryptoQuote, getStockHistory, getStockQuote } from './lib/api';
import { ema, sma } from './lib/indicators';
import { loadWatchlist, saveWatchlist } from './lib/storage';

interface ControlState {
  assetType: AssetType;
  symbol: string;
  vsCurrency: string;
  range: string;
  interval: Interval;
  chartType: 'line' | 'candles';
  showSma20: boolean;
  showEma60: boolean;
  refreshMs: number;
}

const defaultState: ControlState = {
  assetType: 'stock',
  symbol: 'AAPL',
  vsCurrency: 'usd',
  range: '1mo',
  interval: 'daily',
  chartType: 'candles',
  showSma20: true,
  showEma60: true,
  refreshMs: 60000
};

export default function App() {
  const queryClient = useQueryClient();
  const [controls, setControls] = useState<ControlState>(defaultState);
  const [watchlist, setWatchlist] = useState<WatchItem[]>(() => loadWatchlist());
  const [applied, setApplied] = useState<ControlState>(defaultState);

  const quoteQuery = useQuery<QuoteData>({
    queryKey: ['quote', applied],
    queryFn: () =>
      applied.assetType === 'stock'
        ? getStockQuote(applied.symbol)
        : getCryptoQuote(applied.symbol, applied.vsCurrency),
    staleTime: 20_000,
    refetchInterval: applied.refreshMs,
    retry: 1
  });

  const historyQuery = useQuery({
    queryKey: ['history', applied],
    queryFn: () =>
      applied.assetType === 'stock'
        ? getStockHistory(applied.symbol, applied.range, applied.interval)
        : getCryptoHistory(applied.symbol, applied.vsCurrency, applied.range === '1d' ? '1' : applied.range === '5d' ? '5' : '30'),
    staleTime: 20_000,
    refetchInterval: applied.refreshMs,
    retry: 1
  });

  const sma20 = useMemo(() => sma(historyQuery.data?.candles ?? [], 20), [historyQuery.data?.candles]);
  const ema60 = useMemo(() => ema(historyQuery.data?.candles ?? [], 60), [historyQuery.data?.candles]);

  const handleApply = async () => {
    setApplied(controls);
    await queryClient.cancelQueries({ queryKey: ['quote'] });
    await queryClient.cancelQueries({ queryKey: ['history'] });
    quoteQuery.refetch();
    historyQuery.refetch();
  };

  const upsertWatchlist = (type: AssetType, id: string) => {
    const next = Array.from(new Map([...watchlist, { type, id }].map((item) => [`${item.type}-${item.id}`, item])).values());
    setWatchlist(next);
    saveWatchlist(next);
  };

  const removeWatchlist = (type: AssetType, id: string) => {
    const next = watchlist.filter((item) => !(item.type === type && item.id === id));
    setWatchlist(next);
    saveWatchlist(next);
  };

  const selectWatch = (item: WatchItem) => {
    setControls((prev) => ({ ...prev, assetType: item.type, symbol: item.id }));
    setApplied((prev) => ({ ...prev, assetType: item.type, symbol: item.id }));
  };

  const quoteError = quoteQuery.error instanceof Error ? quoteQuery.error.message : '';
  const historyError = historyQuery.error instanceof Error ? historyQuery.error.message : '';

  return (
    <div className="layout">
      <Sidebar
        {...controls}
        onChange={(patch) => setControls((prev) => ({ ...prev, ...patch }))}
        onApply={handleApply}
      />

      <main>
        <h1>Stock + Crypto Dashboard</h1>

        {(quoteError || historyError) && (
          <div className="error-box">
            <p>{quoteError || historyError}</p>
            <p>
              {quoteError.includes('ALPHAVANTAGE') && '주식 데이터는 ALPHAVANTAGE_API_KEY 설정이 필요합니다.'}
              {(quoteError.includes('COINGECKO') || historyError.includes('COINGECKO')) &&
                '코인 데이터는 COINGECKO_API_KEY 설정 시 안정적으로 동작합니다.'}
            </p>
            <button onClick={() => { quoteQuery.refetch(); historyQuery.refetch(); }}>Retry</button>
          </div>
        )}

        {(quoteQuery.isLoading || historyQuery.isLoading) && <div className="card">Loading...</div>}

        <KpiCards data={quoteQuery.data} />

        {historyQuery.data?.candles?.length ? (
          <PriceChart
            candles={historyQuery.data.candles}
            chartType={controls.chartType}
            sma20={sma20}
            ema60={ema60}
            showSma20={controls.showSma20}
            showEma60={controls.showEma60}
          />
        ) : (
          !historyQuery.isLoading && <div className="card">No data.</div>
        )}

        <Watchlist items={watchlist} onAdd={upsertWatchlist} onRemove={removeWatchlist} onSelect={selectWatch} />
      </main>
    </div>
  );
}
