import { createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import type { Candle } from '../types';
import type { IndicatorPoint } from '../lib/indicators';

interface Props {
  candles: Candle[];
  chartType: 'line' | 'candles';
  sma20: IndicatorPoint[];
  ema60: IndicatorPoint[];
  showSma20: boolean;
  showEma60: boolean;
}

export function PriceChart({ candles, chartType, sma20, ema60, showSma20, showEma60 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 420,
      layout: { background: { color: '#111827' }, textColor: '#e5e7eb' },
      grid: { vertLines: { color: '#1f2937' }, horzLines: { color: '#1f2937' } }
    });

    if (chartType === 'candles') {
      const series = chart.addCandlestickSeries();
      series.setData(candles.map((c) => ({ time: c.time as never, open: c.open, high: c.high, low: c.low, close: c.close })));
    } else {
      const series = chart.addLineSeries({ color: '#22d3ee', lineWidth: 2 });
      series.setData(candles.map((c) => ({ time: c.time as never, value: c.close })));
    }

    if (showSma20) {
      const series = chart.addLineSeries({ color: '#f59e0b', lineWidth: 2 });
      series.setData(sma20.map((v) => ({ time: v.time as never, value: v.value })));
    }

    if (showEma60) {
      const series = chart.addLineSeries({ color: '#a78bfa', lineWidth: 2 });
      series.setData(ema60.map((v) => ({ time: v.time as never, value: v.value })));
    }

    chart.timeScale().fitContent();

    const resize = new ResizeObserver(() => {
      chart.applyOptions({ width: containerRef.current?.clientWidth ?? 700 });
    });
    resize.observe(containerRef.current);

    return () => {
      resize.disconnect();
      chart.remove();
    };
  }, [candles, chartType, sma20, ema60, showSma20, showEma60]);

  return <section className="card"><div ref={containerRef} /></section>;
}
