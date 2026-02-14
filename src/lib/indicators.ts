import type { Candle } from '../types';

export interface IndicatorPoint {
  time: number;
  value: number;
}

export const sma = (candles: Candle[], period: number): IndicatorPoint[] => {
  if (candles.length < period) return [];

  return candles.map((candle, index) => {
    if (index < period - 1) return null;
    const window = candles.slice(index - period + 1, index + 1);
    const sum = window.reduce((acc, point) => acc + point.close, 0);
    return { time: candle.time, value: Number((sum / period).toFixed(4)) };
  }).filter((point): point is IndicatorPoint => point !== null);
};

export const ema = (candles: Candle[], period: number): IndicatorPoint[] => {
  if (candles.length < period) return [];
  const multiplier = 2 / (period + 1);
  const values: IndicatorPoint[] = [];
  let previousEma = candles.slice(0, period).reduce((acc, c) => acc + c.close, 0) / period;

  for (let i = period - 1; i < candles.length; i += 1) {
    const price = candles[i].close;
    previousEma = i === period - 1 ? previousEma : (price - previousEma) * multiplier + previousEma;
    values.push({ time: candles[i].time, value: Number(previousEma.toFixed(4)) });
  }

  return values;
};
