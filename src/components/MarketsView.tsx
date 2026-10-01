import React, { useState } from 'react';
import { WatchlistItem } from '../types';

interface MarketsViewProps {
  onSelectSymbolForDetails: (symbol: string) => void;
  onOpenChart: (symbol: string) => void;
}

export const MarketsView: React.FC<MarketsViewProps> = ({
  onSelectSymbolForDetails,
  onOpenChart,
}) => {
  const [activeAssetClass, setActiveAssetClass] = useState('Crypto');
  const [heatmapMode, setHeatmapMode] = useState<'treemap' | 'list'>('treemap');
  const [moverTab, setMoverTab] = useState<'gainers' | 'losers' | 'active' | 'ath'>('gainers');
  const [capFilter, setCapFilter] = useState('ALL');
  const [exchangeFilter, setExchangeFilter] = useState('ALL');
  const [screenerModalOpen, setScreenerModalOpen] = useState(false);
  const [alertSetMessage, setAlertSetMessage] = useState<string | null>(null);

  const assetClasses = [
    { label: 'All', value: 'All' },
    { label: 'Crypto', live: true, value: 'Crypto' },
    { label: 'Stocks', value: 'Stocks' },
    { label: 'Indices', value: 'Indices' },
    { label: 'Forex', value: 'Forex' },
    { label: 'Futures', value: 'Futures' },
  ];

  const macroStats = [
    { label: 'S&P 500', value: '5,482.80', change: '+0.42%', up: true },
    { label: 'DXY', value: '105.42', change: '-0.18%', up: false },
    { label: 'US 10Y', value: '4.28%', change: '+0.02%', up: true },
    { label: 'VIX', value: '12.45', change: '-4.1%', up: false },
  ];

  const heatmapBlocks = [
    { symbol: 'BTC', price: '$64,812.50', change: '+2.26%', cap: 'CAP $1.28T', color: 'bg-[#089981]', colSpan: 'col-span-3 sm:col-span-3', rowSpan: 'row-span-2' },
    { symbol: 'ETH', price: '$3,490.15', change: '+1.74%', cap: 'CAP $419B', color: 'bg-[#089981]/90', colSpan: 'col-span-3 sm:col-span-3', rowSpan: 'row-span-2' },
    { symbol: 'SOL', price: '$141.20', change: '-0.85%', cap: '$64B', color: 'bg-[#f23645]', colSpan: 'col-span-2 sm:col-span-1', rowSpan: 'row-span-1' },
    { symbol: 'BNB', price: '$574.80', change: '+0.45%', cap: '$88B', color: 'bg-[#089981]/80', colSpan: 'col-span-2 sm:col-span-1', rowSpan: 'row-span-1' },
    { symbol: 'XRP', price: '$0.4820', change: '-1.20%', cap: '$27B', color: 'bg-[#f23645]', colSpan: 'col-span-1 sm:col-span-1', rowSpan: 'row-span-1' },
    { symbol: 'DOGE', price: '$0.1245', change: '+3.40%', cap: '$18B', color: 'bg-[#089981]', colSpan: 'col-span-1 sm:col-span-1', rowSpan: 'row-span-1' },
  ];

  const sectors = [
    { name: 'Meme Tokens', change: '+12.5%', lead: 'PEPE (+18.4%)', width: '85%', isUp: true },
    { name: 'AI & Data', change: '+7.8%', lead: 'RENDER (+14.2%)', width: '68%', isUp: true },
    { name: 'Layer 1', change: '+4.2%', lead: 'SUI (+9.8%)', width: '52%', isUp: true },
    { name: 'DeFi', change: '-0.4%', lead: 'Lag: UNI (-2.1%)', width: '25%', isUp: false },
  ];

  const movers = {
    gainers: [
      { letter: 'P', symbol: 'PEPE', pair: '/USDT', exchange: 'Binance', vol: '$842M Vol', price: '$0.00001142', change: '+18.4%' },
      { letter: 'R', symbol: 'RENDER', pair: '/USDT', exchange: 'Bybit', vol: '$310M Vol', price: '$7.824', change: '+14.2%' },
      { letter: 'N', symbol: 'NEAR', pair: '/USDT', exchange: 'Coinbase', vol: '$420M Vol', price: '$5.319', change: '+11.8%' },
      { letter: 'I', symbol: 'INJ', pair: '/USDT', exchange: 'Binance', vol: '$198M Vol', price: '$24.15', change: '+10.6%' },
      { letter: 'S', symbol: 'SUI', pair: '/USDT', exchange: 'OKX', vol: '$274M Vol', price: '$1.028', change: '+9.8%' },
    ],
    losers: [
      { letter: 'L', symbol: 'LDO', pair: '/USDT', exchange: 'Binance', vol: '$94M Vol', price: '$1.42', change: '-8.2%' },
      { letter: 'A', symbol: 'APT', pair: '/USDT', exchange: 'OKX', vol: '$112M Vol', price: '$7.18', change: '-6.4%' },
      { letter: 'T', symbol: 'TIA', pair: '/USDT', exchange: 'Binance', vol: '$145M Vol', price: '$5.82', change: '-5.1%' },
      { letter: 'F', symbol: 'FTM', pair: '/USDT', exchange: 'Bybit', vol: '$68M Vol', price: '$0.62', change: '-4.3%' },
    ],
    active: [
      { letter: 'B', symbol: 'BTC', pair: '/USDT', exchange: 'Binance', vol: '$1.84B Vol', price: '$64,812.50', change: '+2.26%' },
      { letter: 'E', symbol: 'ETH', pair: '/USDT', exchange: 'Binance', vol: '$892M Vol', price: '$3,490.15', change: '+1.74%' },
      { letter: 'S', symbol: 'SOL', pair: '/USDT', exchange: 'Binance', vol: '$542M Vol', price: '$141.20', change: '-0.85%' },
    ],
    ath: [
      { letter: 'B', symbol: 'BNB', pair: '/USDT', exchange: 'Binance', vol: '$240M Vol', price: '$718.50', change: '+5.4%' },
      { letter: 'T', symbol: 'TON', pair: '/USDT', exchange: 'OKX', vol: '$180M Vol', price: '$8.14', change: '+7.2%' },
    ],
  };

  const handleSetAlert = (title: string) => {
    setAlertSetMessage(`Alert reminder registered for: ${title}`);
    setTimeout(() => setAlertSetMessage(null), 2500);
  };

  return (
    <div className="flex flex-col w-full select-none pb-24 bg-[#0f131e]">
      {/* Toast Alert */}
      {alertSetMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#2962ff] text-white text-[12px] font-medium px-4 py-2 rounded-lg shadow-2xl animate-fade-in flex items-center gap-1.5 border border-white/20">
          <span className="material-symbols-outlined text-[16px]">notifications_active</span>
          {alertSetMessage}
        </div>
      )}

      {/* Top Filter Category Row */}
      <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto bg-[#0f131e] border-b border-[#1b1f2b] scrollbar-none">
        {assetClasses.map((item) => {
          const isActive = activeAssetClass === item.value;
          return (
            <button
              key={item.value}
              onClick={() => setActiveAssetClass(item.value)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-colors flex items-center gap-1 border ${
                isActive
                  ? 'bg-[#1b1f2b] border-[#2962ff] text-[#dfe2f2] font-semibold'
                  : 'bg-[#171b26] border-[#262a35] text-[#8d90a2] hover:text-[#dfe2f2]'
              }`}
            >
              {item.live && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#2962ff] animate-pulse inline-block" />
              )}
              <span>{item.label}</span>
              {item.live && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-[#2962ff]/20 text-[#2962ff] font-bold">
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Macro Ticker Bar */}
      <div className="w-full overflow-x-auto py-1.5 px-3 flex items-center gap-2 select-none border-b border-[#1b1f2b] bg-[#0a0e19]/60">
        {macroStats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 bg-[#171b26] border border-[#262a35] px-2.5 py-1 rounded-lg shrink-0 text-[11px] font-mono"
          >
            <span className="text-[#8d90a2]">{stat.label}</span>
            <span className="text-[#dfe2f2] font-semibold">{stat.value}</span>
            <span
              className={`flex items-center gap-0.5 text-[10px] font-bold ${
                stat.up ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              <span>{stat.up ? '▲' : '▼'}</span>
              <span>{stat.change}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col px-3 pt-3 gap-4">
        {/* Section 1: Market Heatmap */}
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#2962ff] text-[18px]">grid_view</span>
              <h3 className="font-bold text-[14px] text-[#dfe2f2]">Market Heatmap</h3>
              <span className="text-[10px] font-mono text-[#8d90a2]">24H WEIGHT</span>
            </div>
            {/* View Mode Toggle: TREEMAP vs LIST */}
            <div className="flex items-center bg-[#0a0e19] p-0.5 rounded border border-[#262a35] text-[10px] font-mono">
              <button
                onClick={() => setHeatmapMode('treemap')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  heatmapMode === 'treemap' ? 'bg-[#262a35] text-[#dfe2f2] font-bold' : 'text-[#8d90a2]'
                }`}
              >
                TREEMAP
              </button>
              <button
                onClick={() => setHeatmapMode('list')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  heatmapMode === 'list' ? 'bg-[#262a35] text-[#dfe2f2] font-bold' : 'text-[#8d90a2]'
                }`}
              >
                LIST
              </button>
            </div>
          </div>

          {/* Treemap Visual Grid */}
          <div className="grid grid-cols-6 gap-1.5 h-44 rounded-lg overflow-hidden">
            {heatmapBlocks.map((block) => (
              <div
                key={block.symbol}
                onClick={() => onSelectSymbolForDetails(block.symbol === 'BTC' ? 'BTCUSDT' : `${block.symbol}USDT`)}
                className={`${block.colSpan} ${block.rowSpan} ${block.color} rounded-lg p-2 flex flex-col justify-between cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all text-white shadow relative overflow-hidden`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold font-mono text-[13px]">{block.symbol}</span>
                  <span className="font-mono text-[10px] font-bold bg-black/25 px-1 py-0.2 rounded">
                    {block.change}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono font-bold text-[12px]">{block.price}</span>
                  <span className="text-[9px] font-mono text-white/70">{block.cap}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Sectors */}
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#089981] text-[18px]">bar_chart</span>
              <h3 className="font-bold text-[14px] text-[#dfe2f2]">Sectors</h3>
            </div>
            <button
              onClick={() => setScreenerModalOpen(true)}
              className="text-[11px] font-mono text-[#8d90a2] hover:text-[#dfe2f2] flex items-center gap-0.5"
            >
              <span>VIEW ALL 18</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {sectors.map((sector) => (
              <div
                key={sector.name}
                className="bg-[#0a0e19] p-2.5 rounded-lg border border-[#262a35] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#dfe2f2]">{sector.name}</span>
                  <span
                    className={`font-mono font-bold ${
                      sector.isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {sector.change}
                  </span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-1.5 bg-[#262a35] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      sector.isUp ? 'bg-[#089981]' : 'bg-[#f23645]'
                    }`}
                    style={{ width: sector.width }}
                  />
                </div>
                <span className="text-[10px] text-[#8d90a2] font-mono truncate">{sector.lead}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Ranked Movers Table */}
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3 flex flex-col gap-2.5 shadow-md">
          {/* Mover Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#262a35] scrollbar-none">
            {[
              { id: 'gainers', label: 'TOP GAINERS' },
              { id: 'losers', label: 'TOP LOSERS' },
              { id: 'active', label: 'MOST ACTIVE (VOL)' },
              { id: 'ath', label: 'ALL-TIME HIGH' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMoverTab(tab.id as any)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-colors ${
                  moverTab === tab.id
                    ? 'bg-[#2962ff] text-white font-bold'
                    : 'text-[#8d90a2] hover:text-[#dfe2f2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sub Filter Chips */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8d90a2] py-0.5">
            <div className="flex items-center gap-2">
              <span className="cursor-pointer hover:text-[#dfe2f2]">CAP: ALL ▾</span>
              <span className="cursor-pointer hover:text-[#dfe2f2]">EXCHANGE: ALL ▾</span>
            </div>
            <span className="text-[#2962ff] font-semibold cursor-pointer">% CHG 24H ↓</span>
          </div>

          {/* Movers List */}
          <div className="flex flex-col gap-1.5">
            {movers[moverTab].map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectSymbolForDetails(`${item.symbol}USDT`)}
                className="flex items-center justify-between p-2 rounded-lg bg-[#0a0e19] hover:bg-[#1b1f2b] active:bg-[#262a35] cursor-pointer transition-colors border border-transparent hover:border-[#313441]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#262a35] flex items-center justify-center font-mono font-bold text-[13px] text-[#b6c4ff]">
                    {item.letter}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 font-mono">
                      <span className="font-bold text-[13px] text-[#dfe2f2]">{item.symbol}</span>
                      <span className="text-[11px] text-[#8d90a2]">{item.pair}</span>
                    </div>
                    <span className="text-[10px] text-[#8d90a2] font-mono">
                      {item.exchange} • {item.vol}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end font-mono">
                  <span className="font-bold text-[13px] text-[#dfe2f2]">{item.price}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm mt-0.5 ${
                      item.change.startsWith('+')
                        ? 'bg-[#089981]/20 text-[#089981]'
                        : 'bg-[#f23645]/20 text-[#f23645]'
                    }`}
                  >
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Upcoming Macro Signals */}
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3.5 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffb3b0] text-[18px]">calendar_month</span>
              <h3 className="font-bold text-[14px] text-[#dfe2f2]">Upcoming Macro Signals</h3>
            </div>
            <span className="text-[10px] font-mono text-[#8d90a2] uppercase tracking-wider">
              CALENDAR
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Event 1 */}
            <div className="p-3 bg-[#0a0e19] rounded-xl border border-[#262a35] flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f23645]" />
                  <span className="font-bold text-[12px] text-[#dfe2f2]">US CPI Inflation Rate YoY</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#f23645]/20 text-[#f23645] font-mono font-bold">
                    HIGH
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8d90a2] pl-3.5">
                  Tomorrow • 08:30 EST (Consensus: 3.1% | Prior: 3.3%)
                </span>
              </div>
              <button
                onClick={() => handleSetAlert('US CPI Inflation')}
                className="w-7 h-7 rounded-lg bg-[#1b1f2b] hover:bg-[#262a35] text-[#8d90a2] hover:text-[#dfe2f2] flex items-center justify-center transition-colors"
                title="Add Reminder Alert"
              >
                <span className="material-symbols-outlined text-[16px]">add_alert</span>
              </button>
            </div>

            {/* Event 2 */}
            <div className="p-3 bg-[#0a0e19] rounded-xl border border-[#262a35] flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#089981]" />
                  <span className="font-bold text-[12px] text-[#dfe2f2]">FOMC Rate Decision & Presser</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#f23645]/20 text-[#f23645] font-mono font-bold">
                    CRITICAL
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8d90a2] pl-3.5">
                  In 3 Days • 14:00 EST (Target: 5.25% - 5.50%)
                </span>
              </div>
              <button
                onClick={() => handleSetAlert('FOMC Rate Decision')}
                className="w-7 h-7 rounded-lg bg-[#1b1f2b] hover:bg-[#262a35] text-[#8d90a2] hover:text-[#dfe2f2] flex items-center justify-center transition-colors"
                title="Add Reminder Alert"
              >
                <span className="material-symbols-outlined text-[16px]">add_alert</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Custom Market Screener Banner */}
        <div
          onClick={() => setScreenerModalOpen(true)}
          className="bg-gradient-to-r from-[#171b26] to-[#1b1f2b] border border-[#262a35] hover:border-[#2962ff]/50 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2962ff] flex items-center justify-center text-white shadow-lg shrink-0">
              <span className="material-symbols-outlined text-[20px]">troubleshoot</span>
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold text-[13px] text-[#dfe2f2] group-hover:text-[#b6c4ff] transition-colors">
                Custom Market Screener
              </h4>
              <p className="text-[11px] text-[#8d90a2] leading-tight">
                Scan 12,000+ assets with RSI, MACD & Volume filters
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#0a0e19] flex items-center justify-center text-[#8d90a2] group-hover:text-white group-hover:bg-[#2962ff] transition-colors shrink-0">
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* Quick Screener Modal */}
      {screenerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 animate-fade-in">
          <div
            className="w-full max-w-md bg-[#171b26] border border-[#262a35] rounded-2xl p-4 flex flex-col gap-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#262a35] pb-2">
              <h3 className="font-bold text-[15px] text-[#dfe2f2]">Quantitative Screener Active</h3>
              <button
                onClick={() => setScreenerModalOpen(false)}
                className="w-7 h-7 rounded flex items-center justify-center text-[#8d90a2] hover:text-[#dfe2f2]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-[12px] text-[#8d90a2]">
              Filtering 12,480 pairs across Binance, Coinbase, OKX, and NASDAQ.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-[#0a0e19] rounded border border-[#262a35]">
                <span className="text-[#8d90a2]">RSI &lt; 30 (Oversold):</span>
                <span className="text-[#089981] font-bold block">42 Assets Found</span>
              </div>
              <div className="p-2 bg-[#0a0e19] rounded border border-[#262a35]">
                <span className="text-[#8d90a2]">MACD Bullish Cross:</span>
                <span className="text-[#2962ff] font-bold block">18 Assets Found</span>
              </div>
            </div>
            <button
              onClick={() => {
                setScreenerModalOpen(false);
                onOpenChart('BTCUSDT');
              }}
              className="w-full py-2 bg-[#2962ff] text-white text-[12px] font-bold rounded-lg hover:bg-[#2962ff]/90 transition-colors shadow"
            >
              Apply Filter to Terminal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
