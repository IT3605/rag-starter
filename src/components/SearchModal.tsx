import React, { useState } from 'react';
import { WatchlistItem, AssetType } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (item: WatchlistItem) => void;
  allSymbols: WatchlistItem[];
  onAddToWatchlist?: (item: WatchlistItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
  allSymbols,
  onAddToWatchlist,
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const filters = ['ALL', 'Crypto', 'Stock', 'Forex', 'Metal', 'Index'];

  const filtered = allSymbols.filter((item) => {
    const matchesFilter = selectedFilter === 'ALL' || item.sector === selectedFilter;
    const matchesQuery =
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 pt-12 sm:pt-4 animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#171b26] border border-[#262a35] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-3 bg-[#1b1f2b] border-b border-[#262a35] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#8d90a2] text-[20px]">search</span>
          <input
            autoFocus
            type="text"
            placeholder="Search symbol, currency or company (e.g. BTC, NVDA, EUR)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-[14px] font-mono text-[#dfe2f2] placeholder:text-[#8d90a2]/60 w-full focus:outline-none uppercase"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8d90a2] hover:text-[#dfe2f2] text-[18px]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-[11px] font-mono text-[#8d90a2] hover:text-[#dfe2f2] rounded bg-[#262a35]"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-3 py-2 bg-[#0a0e19] flex items-center gap-1.5 overflow-x-auto border-b border-[#262a35] scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-colors ${
                selectedFilter === f
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'bg-[#1b1f2b] text-[#8d90a2] hover:text-[#dfe2f2]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-[55vh]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#8d90a2] font-mono text-[13px]">
              No market symbols found matching &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item) => {
              const isPositive = item.changePct >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => {
                    onSelectSymbol(item);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1b1f2b] active:bg-[#262a35] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#262a35] flex items-center justify-center font-mono font-bold text-[11px] text-[#b6c4ff]">
                      {item.symbol.substring(0, 3)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[13px] text-[#dfe2f2]">
                          {item.symbol}
                        </span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#313441] text-[#8d90a2] font-semibold uppercase">
                          {item.sector}
                        </span>
                        <span className="text-[10px] text-[#66dabf] font-mono">
                          {item.exchange}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8d90a2]">{item.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end font-mono">
                      <span className="font-bold text-[13px] text-[#dfe2f2]">
                        ${item.price.toLocaleString('en-US', { minimumFractionDigits: item.decimals })}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePct.toFixed(2)}%
                      </span>
                    </div>

                    {onAddToWatchlist && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToWatchlist(item);
                        }}
                        title="Add to Watchlist"
                        className="w-7 h-7 rounded-lg bg-[#262a35] hover:bg-[#2962ff] text-[#8d90a2] hover:text-white flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
