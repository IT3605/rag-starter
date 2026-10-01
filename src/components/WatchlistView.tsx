import React, { useState } from 'react';
import { WatchlistItem } from '../types';
import { MACRO_TICKERS } from '../data/mockData';

interface WatchlistViewProps {
  watchlists: Record<string, WatchlistItem[]>;
  currentListName: string;
  onSelectListName: (name: string) => void;
  onSelectSymbol: (item: WatchlistItem) => void;
  onOpenAddSymbol: () => void;
  priceTickMap: Record<string, 'up' | 'down' | null>;
  onOpenSymbolDetails?: (item: WatchlistItem) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlists,
  currentListName,
  onSelectListName,
  onSelectSymbol,
  onOpenAddSymbol,
  priceTickMap,
  onOpenSymbolDetails,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPercent, setShowPercent] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const currentList = watchlists[currentListName] || [];

  const filteredItems = currentList.filter(
    (item) =>
      item.symbol.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getSectorIcon = (sector: string, symbol: string) => {
    switch (sector) {
      case 'Crypto':
        if (symbol.startsWith('BTC')) return { icon: 'currency_bitcoin', color: 'text-[#66dabf]' };
        if (symbol.startsWith('ETH')) return { icon: 'diamond', color: 'text-[#b6c4ff]' };
        return { icon: 'cyclone', color: 'text-[#84f7db]' };
      case 'Stock':
        if (symbol === 'NVDA') return { icon: 'memory', color: 'text-[#66dabf]' };
        if (symbol === 'AAPL') return { icon: 'phone_iphone', color: 'text-[#8d90a2]' };
        if (symbol === 'TSLA') return { icon: 'electric_car', color: 'text-[#ffb3b0]' };
        return { icon: 'domain', color: 'text-[#66dabf]' };
      case 'Forex':
        return { icon: 'euro', color: 'text-[#b6c4ff]' };
      case 'Metal':
        return { icon: 'monetization_on', color: 'text-[#84f7db]' };
      case 'Index':
        return { icon: 'stacked_line_chart', color: 'text-[#2962ff]' };
      default:
        return { icon: 'token', color: 'text-[#66dabf]' };
    }
  };

  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length === 0) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 64;
    const height = 24;

    const coords = points.map((p, i) => {
      const x = 1 + (i / (points.length - 1)) * (width - 2);
      const y = height - 2 - ((p - min) / range) * (height - 6);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');

    const strokeColor = isPositive ? '#089981' : '#f23645';

    return (
      <svg className="w-full h-full stroke-current" fill="none" preserveAspectRatio="none" viewBox="0 0 64 24">
        <path
          d={coords}
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const formatPrice = (val: number, decimals: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <div className="flex flex-col w-full select-none pb-24">
      {/* Top Command & List Selector Bar */}
      <div className="sticky top-14 z-30 bg-[#0f131e]/95 backdrop-blur-md px-3 py-2 flex items-center justify-between gap-2 border-b border-[#1b1f2b]">
        {/* Watchlist Category Dropdown */}
        <div className="relative inline-block">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 bg-[#262a35] hover:bg-[#313441] active:scale-95 text-[#dfe2f2] px-3 py-1.5 rounded-lg transition-all border border-[#313441]"
            aria-expanded={dropdownOpen}
          >
            <span className="w-2 h-2 rounded-full bg-[#66dabf] inline-block animate-pulse" />
            <span className="font-semibold text-[15px] text-[#dfe2f2]">{currentListName}</span>
            <span className={`material-symbols-outlined text-[#8d90a2] text-[18px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {dropdownOpen && (
            <div
              className="absolute left-0 mt-1 w-48 bg-[#262a35] rounded-xl shadow-2xl py-1 z-40 border border-[#313441] divide-y divide-[#313441]/50"
              onClick={(e) => e.stopPropagation()}
            >
              {Object.keys(watchlists).map((listName) => (
                <button
                  key={listName}
                  onClick={() => {
                    onSelectListName(listName);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between hover:bg-[#313441] transition-colors ${
                    currentListName === listName ? 'text-[#66dabf] font-semibold' : 'text-[#c3c5d8]'
                  }`}
                >
                  <span>{listName}</span>
                  {currentListName === listName && (
                    <span className="material-symbols-outlined text-[16px] text-[#66dabf]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions (Unit toggle, Edit, Add) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowPercent(!showPercent)}
            title="Toggle Percent / Net Value"
            className="bg-[#262a35] hover:bg-[#313441] active:scale-95 text-[#8d90a2] hover:text-[#dfe2f2] px-2 py-1.5 rounded-lg transition-colors font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 border border-[#313441]"
          >
            <span className="text-[#b6c4ff] font-bold">{showPercent ? '%' : '$'}</span>
            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
          </button>

          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3 py-1.5 rounded-lg transition-colors text-[10px] font-semibold uppercase tracking-wider border ${
              isEditMode
                ? 'bg-[#2962ff] text-white border-[#2962ff]'
                : 'bg-[#262a35] hover:bg-[#313441] text-[#c3c5d8] border-[#313441]'
            }`}
          >
            {isEditMode ? 'Done' : 'Edit'}
          </button>

          <button
            aria-label="Add symbol"
            onClick={onOpenAddSymbol}
            className="bg-[#2962ff] hover:bg-[#2962ff]/85 active:scale-90 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </div>

      {/* Horizontal Live Macro Mini-Ticker Bar */}
      <div className="w-full overflow-x-auto py-2 px-3 flex items-center gap-2 select-none border-b border-[#1b1f2b] bg-[#0a0e19]/40">
        {MACRO_TICKERS.map((macro, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 bg-[#1b1f2b] border border-[#262a35] px-2.5 py-1 rounded-lg shrink-0 hover:bg-[#262a35] transition-colors cursor-pointer"
          >
            <span className="text-[10px] text-[#c3c5d8] font-medium">{macro.label}</span>
            <span className="font-mono text-[11px] text-[#dfe2f2]">{macro.value}</span>
            <span
              className={`font-mono text-[10px] px-1 py-0.2 rounded-sm font-semibold ${
                macro.isPositive ? 'text-[#089981] bg-[#089981]/15' : 'text-[#f23645] bg-[#f23645]/15'
              }`}
            >
              {macro.change}
            </span>
          </div>
        ))}
      </div>

      {/* Table Column Headers */}
      <div className="px-3 pt-3 pb-1.5 flex items-center justify-between text-[#8d90a2] text-[10px] font-semibold tracking-wider uppercase select-none">
        <div className="flex items-center gap-1">
          <span>Symbol / Sector</span>
        </div>
        <div className="flex items-center gap-4 text-right">
          <span className="w-16 text-center">Trend (24H)</span>
          <span className="w-20">Last / Chg</span>
        </div>
      </div>

      {/* Watchlist Items List */}
      <div className="flex flex-col px-3 gap-1 mt-1">
        {filteredItems.map((item) => {
          const isPositive = item.changePct >= 0;
          const tickState = priceTickMap[item.symbol];
          const iconInfo = getSectorIcon(item.sector, item.symbol);

          return (
            <div
              key={item.symbol}
              onClick={() => onSelectSymbol(item)}
              className={`group flex items-center justify-between py-2 px-2.5 rounded-lg bg-[#1b1f2b] hover:bg-[#262a35] active:bg-[#313441] border border-transparent hover:border-[#313441] transition-all cursor-pointer select-none relative ${
                tickState === 'up'
                  ? 'ring-1 ring-[#089981]/50 bg-[#089981]/5'
                  : tickState === 'down'
                  ? 'ring-1 ring-[#f23645]/50 bg-[#f23645]/5'
                  : ''
              }`}
            >
              {/* Left: Icon & Symbol & Sector */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#313441] flex items-center justify-center shrink-0">
                  <span className={`material-symbols-outlined ${iconInfo.color} text-[20px]`}>
                    {iconInfo.icon}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[13px] text-[#dfe2f2] font-semibold truncate">
                      {item.symbol}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-[#313441] text-[#8d90a2] font-semibold uppercase">
                      {item.sector}
                    </span>
                    {onOpenSymbolDetails && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSymbolDetails(item);
                        }}
                        title="View Detailed Technical Summary"
                        className="text-[#8d90a2] hover:text-[#2962ff] flex items-center"
                      >
                        <span className="material-symbols-outlined text-[14px]">info</span>
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8d90a2] truncate">{item.name}</span>
                </div>
              </div>

              {/* Right: Sparkline & Price / Delta */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-16 h-7 flex items-center justify-center">
                  {renderSparkline(item.sparkline, isPositive)}
                </div>

                <div className="flex flex-col items-end w-20">
                  <span
                    className={`font-mono text-[13px] font-semibold tracking-tight transition-colors ${
                      tickState === 'up'
                        ? 'text-[#089981]'
                        : tickState === 'down'
                        ? 'text-[#f23645]'
                        : 'text-[#dfe2f2]'
                    }`}
                  >
                    ${formatPrice(item.price, item.decimals)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPercent(!showPercent);
                    }}
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-sm mt-0.5 min-w-[58px] text-center tracking-tight shadow-sm transition-all ${
                      isPositive
                        ? 'bg-[#089981] text-white hover:brightness-110'
                        : 'bg-[#f23645] text-white hover:brightness-110'
                    }`}
                  >
                    {showPercent
                      ? `${isPositive ? '+' : ''}${item.changePct.toFixed(2)}%`
                      : `${isPositive ? '+$' : '-$'}${Math.abs(item.changeVal).toFixed(
                          item.decimals === 4 ? 4 : 2
                        )}`}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Sentiment & Fear/Greed Meter */}
      <div className="px-3 my-4">
        <div className="bg-[#262a35] rounded-xl p-3 shadow-lg border border-[#313441] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#66dabf] text-[18px]">speed</span>
              <span className="font-semibold text-[13px] text-[#dfe2f2]">Market Sentiment</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-[#c3c5d8]">Index:</span>
              <span className="text-[#66dabf] font-bold">68</span>
              <span className="px-1.5 py-0.5 rounded bg-[#66dabf]/15 text-[#66dabf] text-[10px] font-semibold">
                Greed
              </span>
            </div>
          </div>

          {/* Segmented Multi-level Progress Bar */}
          <div className="w-full flex flex-col gap-1">
            <div className="relative w-full h-2.5 bg-[#0a0e19] rounded-full overflow-hidden flex border border-[#313441]/60">
              {/* Extreme Fear */}
              <div className="h-full w-1/4 bg-[#da2237]/70" title="Extreme Fear" />
              {/* Fear */}
              <div className="h-full w-1/4 bg-[#ffb3b0]/50" title="Fear" />
              {/* Neutral / Greed */}
              <div className="h-full w-1/4 bg-[#20a28a]/60" title="Neutral" />
              {/* Extreme Greed */}
              <div className="h-full w-1/4 bg-[#089981]" title="Extreme Greed" />
              {/* Needle mark */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_8px_#ffffff] rounded-full transform -translate-x-1/2 transition-all duration-700 ease-out"
                style={{ left: '68%' }}
              />
            </div>
            <div className="flex justify-between text-[#8d90a2] text-[9px] uppercase font-semibold tracking-wider">
              <span>0 Extreme Fear</span>
              <span>50 Neutral</span>
              <span>100 Extreme Greed</span>
            </div>
          </div>

          {/* Quick Context Micro-stats */}
          <div className="pt-1 flex items-center justify-between text-[#c3c5d8] text-[11px] border-t border-[#313441]/40 mt-0.5">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
              <span>Advancing: <strong className="text-[#dfe2f2] font-mono font-medium">62%</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f23645]" />
              <span>Declining: <strong className="text-[#dfe2f2] font-mono font-medium">38%</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#8d90a2]">Vol:</span>
              <span className="text-[#dfe2f2] font-mono font-medium">$42.8B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
