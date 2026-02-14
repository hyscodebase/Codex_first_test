import type { AssetType, WatchItem } from '../types';

interface Props {
  items: WatchItem[];
  onAdd: (type: AssetType, id: string) => void;
  onRemove: (type: AssetType, id: string) => void;
  onSelect: (item: WatchItem) => void;
}

export function Watchlist({ items, onAdd, onRemove, onSelect }: Props) {
  const grouped = {
    stock: items.filter((item) => item.type === 'stock'),
    crypto: items.filter((item) => item.type === 'crypto')
  };

  return (
    <section className="card">
      <h3>Watchlist</h3>
      <div className="watch-columns">
        {(['stock', 'crypto'] as AssetType[]).map((type) => (
          <div key={type}>
            <h4>{type.toUpperCase()}</h4>
            {grouped[type].map((item) => (
              <div className="watch-item" key={`${item.type}-${item.id}`}>
                <button onClick={() => onSelect(item)}>{item.id}</button>
                <button onClick={() => onRemove(item.type, item.id)}>x</button>
              </div>
            ))}
            <button
              onClick={() => {
                const id = window.prompt(`${type} id to add`);
                if (id) onAdd(type, id.trim());
              }}
            >
              + Add {type}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
