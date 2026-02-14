import type { QuoteData } from '../types';

export function KpiCards({ data }: { data?: QuoteData }) {
  if (!data) return null;

  const changeText = data.changePercent != null ? `${data.changePercent.toFixed(2)}%` : '-';

  return (
    <section className="kpi-grid">
      <div className="card"><h4>Price</h4><p>{data.price}</p></div>
      <div className="card"><h4>Change</h4><p>{changeText}</p></div>
      <div className="card"><h4>High</h4><p>{data.high ?? '-'}</p></div>
      <div className="card"><h4>Low</h4><p>{data.low ?? '-'}</p></div>
      <div className="card"><h4>Volume</h4><p>{data.volume ?? '-'}</p></div>
    </section>
  );
}
