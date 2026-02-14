import type { AssetType, Interval } from '../types';

interface Props {
  assetType: AssetType;
  symbol: string;
  vsCurrency: string;
  range: string;
  interval: Interval;
  chartType: 'line' | 'candles';
  showSma20: boolean;
  showEma60: boolean;
  refreshMs: number;
  onChange: (patch: Partial<Props>) => void;
  onApply: () => void;
}

export function Sidebar(props: Props) {
  return (
    <aside className="sidebar card">
      <h2>Controls</h2>

      <label>
        Asset
        <select value={props.assetType} onChange={(e) => props.onChange({ assetType: e.target.value as AssetType })}>
          <option value="stock">Stock</option>
          <option value="crypto">Crypto</option>
        </select>
      </label>

      <label>
        {props.assetType === 'stock' ? 'Ticker' : 'Coin ID'}
        <input
          value={props.symbol}
          onChange={(e) => props.onChange({ symbol: e.target.value })}
          placeholder={props.assetType === 'stock' ? 'AAPL' : 'bitcoin'}
        />
      </label>

      <label>
        vs_currency (crypto)
        <input value={props.vsCurrency} onChange={(e) => props.onChange({ vsCurrency: e.target.value })} />
      </label>

      <label>
        Range
        <select value={props.range} onChange={(e) => props.onChange({ range: e.target.value })}>
          <option value="1d">1D</option>
          <option value="5d">5D</option>
          <option value="1mo">1M</option>
          <option value="3mo">3M</option>
          <option value="6mo">6M</option>
          <option value="1y">1Y</option>
        </select>
      </label>

      <label>
        Interval
        <select value={props.interval} onChange={(e) => props.onChange({ interval: e.target.value as Interval })}>
          <option value="1min">1m</option>
          <option value="5min">5m</option>
          <option value="15min">15m</option>
          <option value="30min">30m</option>
          <option value="60min">60m</option>
          <option value="daily">daily</option>
        </select>
      </label>

      <label>
        Chart
        <select value={props.chartType} onChange={(e) => props.onChange({ chartType: e.target.value as 'line' | 'candles' })}>
          <option value="line">Line</option>
          <option value="candles">Candles</option>
        </select>
      </label>

      <label className="check-row">
        <input type="checkbox" checked={props.showSma20} onChange={(e) => props.onChange({ showSma20: e.target.checked })} />
        SMA(20)
      </label>
      <label className="check-row">
        <input type="checkbox" checked={props.showEma60} onChange={(e) => props.onChange({ showEma60: e.target.checked })} />
        EMA(60)
      </label>

      <label>
        Auto refresh
        <select value={props.refreshMs} onChange={(e) => props.onChange({ refreshMs: Number(e.target.value) })}>
          <option value={30000}>30s</option>
          <option value={60000}>60s</option>
          <option value={300000}>5m</option>
        </select>
      </label>

      <button onClick={props.onApply}>Apply</button>
    </aside>
  );
}
