import React, { useState } from 'react';
import { WatchlistItem } from '../types';

interface SymbolDetailsModalProps {
  isOpen: boolean;
  item: WatchlistItem;
  livePrice: number;
  onClose: () => void;
  onGoToChart: (item: WatchlistItem) => void;
  onOpenTrade: (item: WatchlistItem, side: 'buy' | 'sell', price: number) => void;
}

export const SymbolDetailsModal: React.FC<SymbolDetailsModalProps> = ({
  isOpen,
  item,
  livePrice,
  onClose,
  onGoToChart,
  onOpenTrade,
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '4H' | '1W'>('1D');
  const [isFavorite, setIsFavorite] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const isPositive = item.changePct >= 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0f131e] overflow-y-auto animate-fade-in pb-20 select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#2962ff] text-white text-[12px] font-medium px-4 py-2 rounded-lg shadow-2xl animate-fade-in flex items-center gap-1.5 border border-white/20">
          <span className="material-symbols-outlined text-[16px]">info</span>
          {toastMessage}
        </div>
      )}

      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-[#1b1f2b]/95 backdrop-blur-xl border-b border-[#262a35] h-14 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#c3c5d8] hover:text-white hover:bg-[#262a35] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <img
            alt="TradingView Logo"
            className="h-7 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XVNRnbYGVTHQL2KmC_tJPbbKmBVFUFLIiiS2e3atio7zWvftj8GLEjR_7ohxbqeycejMLM4pNmcgevRL42G3jefS0nqCuFbyI_8kivf39mhO_uRARVxXXhE0npsQ077dtde3V8ofPoYRiUMC-kNsiu1FzZStrD9CdD7W9joGSBy3wmgHLaUbh3LcBLrXzkBn-3ALSi4nwxWFLm8b92zJ4FlOJpI8EMTSrRpRVDPiZIzTd6gpH9eOFuCQ"
          />
          <span className="font-bold text-[16px] text-[#dfe2f2]">Symbol Details</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => showToast('Price alert added for ' + item.symbol)}
            className="w-9 h-9 flex items-center justify-center text-[#8d90a2] hover:text-[#dfe2f2] rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#b6c4ff] flex items-center justify-center text-[#002780] font-bold text-[13px]">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col p-3 gap-3.5 max-w-lg mx-auto w-full">
        {/* Symbol Title & Price Card */}
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3.5 flex flex-col gap-2 shadow-md">
          {/* Top Asset Identity Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#f59e0b] flex items-center justify-center text-white font-bold text-[20px] shadow">
                {item.symbol.charAt(0)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[17px] text-[#dfe2f2]">{item.symbol}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#262a35] text-[#8d90a2] font-mono font-bold uppercase">
                    SPOT
                  </span>
                </div>
                <span className="text-[11px] text-[#8d90a2]">
                  {item.exchange} • {item.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsFavorite(!isFavorite);
                  showToast(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8d90a2] hover:text-[#f59e0b]"
              >
                <span className={`material-symbols-outlined text-[19px] ${isFavorite ? 'text-[#f59e0b]' : ''}`}>
                  star
                </span>
              </button>
              <button
                onClick={() => showToast('Share link copied')}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8d90a2] hover:text-white"
              >
                <span className="material-symbols-outlined text-[19px]">share</span>
              </button>
              <button
                onClick={() => showToast('Alert set at $' + livePrice.toFixed(2))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8d90a2] hover:text-white"
              >
                <span className="material-symbols-outlined text-[19px]">add_alert</span>
              </button>
            </div>
          </div>

          {/* Live Hero Price */}
          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[24px] font-bold text-[#dfe2f2] tracking-tight">
                ${livePrice.toLocaleString('en-US', { minimumFractionDigits: item.decimals })}
              </span>
              <span
                className={`font-mono text-[13px] font-bold flex items-center gap-0.5 ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                <span>{isPositive ? '▲' : '▼'}</span>
                <span>
                  {isPositive ? '+' : ''}
                  {item.changePct.toFixed(2)}%
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#089981] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-pulse" />
              <span>LIVE TICKER</span>
            </div>
          </div>

          <span className="text-[11px] font-mono text-[#8d90a2]">
            {isPositive ? '+$' : '-$'}
            {Math.abs(item.changeVal).toFixed(2)} Today
          </span>

          {/* 3-Column Stats Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#262a35] text-[10px] font-mono">
            <div>
              <span className="text-[#8d90a2] block uppercase">24H HIGH</span>
              <span className="text-[#dfe2f2] font-semibold">${item.high24h.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[#8d90a2] block uppercase">24H LOW</span>
              <span className="text-[#dfe2f2] font-semibold">${item.low24h.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[#8d90a2] block uppercase">24H VOL (USDT)</span>
              <span className="text-[#dfe2f2] font-semibold">{item.vol24h}</span>
            </div>
          </div>
        </div>

        {/* Technical Summary Gauge */}
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3.5 flex flex-col gap-2 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#66dabf] text-[18px]">speed</span>
              <h3 className="font-bold text-[14px] text-[#dfe2f2]">Technical Summary</h3>
            </div>
            {/* Timeframe selector */}
            <div className="flex bg-[#0a0e19] p-0.5 rounded border border-[#262a35] text-[10px] font-mono">
              {(['1D', '4H', '1W'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    timeframe === tf ? 'bg-[#262a35] text-[#dfe2f2] font-bold' : 'text-[#8d90a2]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Semi-circular Speedometer Visual */}
          <div className="relative w-full h-32 flex flex-col items-center justify-end overflow-hidden pt-2">
            <svg viewBox="0 0 200 110" className="w-56 h-28">
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f23645" />
                  <stop offset="50%" stopColor="#8d90a2" />
                  <stop offset="100%" stopColor="#089981" />
                </linearGradient>
              </defs>
              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Dial Needle pointing to Strong Buy (approx 145 degrees) */}
              <line
                x1="100"
                y1="100"
                x2="155"
                y2="45"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-700"
              />
              <circle cx="100" cy="100" r="5" fill="#ffffff" />
            </svg>

            {/* Labels below arc */}
            <div className="w-full flex justify-between px-4 text-[9px] font-mono font-bold uppercase tracking-wider text-[#8d90a2]">
              <span className="text-[#f23645]">STRONG SELL</span>
              <span>NEUTRAL</span>
              <span className="text-[#089981]">STRONG BUY</span>
            </div>

            {/* Current rating pill */}
            <div className="mt-1 px-3 py-0.5 rounded-full bg-[#089981]/20 text-[#089981] font-mono text-[11px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-pulse" />
              <span>STRONG BUY</span>
            </div>
          </div>

          {/* Oscillators & Moving Avg Breakdown Boxes */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#262a35] text-[11px] font-mono">
            {/* Oscillators */}
            <div className="bg-[#0a0e19] p-2.5 rounded-lg border border-[#262a35] flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#8d90a2]">Oscillators</span>
                <span className="text-[#dfe2f2] font-semibold">NEUTRAL</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                <div className="bg-[#f23645]/20 text-[#f23645] rounded py-1 font-bold">2 SELL</div>
                <div className="bg-[#262a35] text-[#8d90a2] rounded py-1 font-bold">8 NEUT</div>
                <div className="bg-[#089981]/20 text-[#089981] rounded py-1 font-bold">1 BUY</div>
              </div>
            </div>

            {/* Moving Averages */}
            <div className="bg-[#0a0e19] p-2.5 rounded-lg border border-[#262a35] flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#8d90a2]">Moving Avg</span>
                <span className="text-[#089981] font-semibold">STRONG BUY</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                <div className="bg-[#f23645]/20 text-[#f23645] rounded py-1 font-bold">1 SELL</div>
                <div className="bg-[#262a35] text-[#8d90a2] rounded py-1 font-bold">1 NEUT</div>
                <div className="bg-[#089981]/20 text-[#089981] rounded py-1 font-bold">13 BUY</div>
              </div>
            </div>
          </div>
        </div>

        {/* Depth & Order Book Preview */}
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3.5 flex flex-col gap-2 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#2962ff] text-[18px]">reorder</span>
              <h3 className="font-bold text-[14px] text-[#dfe2f2]">Depth & Order Book</h3>
            </div>
            <span className="text-[10px] font-mono text-[#8d90a2]">
              Spread: 0.10 (0.00%)
            </span>
          </div>

          <div className="flex flex-col text-[11px] font-mono">
            <div className="grid grid-cols-4 text-[9px] uppercase tracking-wider text-[#8d90a2] pb-1 border-b border-[#262a35]">
              <span>BID SIZE</span>
              <span className="text-right pr-2">BID PRICE</span>
              <span className="pl-2">ASK PRICE</span>
              <span className="text-right">ASK SIZE</span>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-4 py-1 border-b border-[#262a35]/40 items-center">
              <span className="text-[#dfe2f2]">1.4820</span>
              <span className="text-[#089981] font-bold text-right pr-2">64,821.40</span>
              <span className="text-[#f23645] font-bold pl-2">64,821.50</span>
              <span className="text-[#dfe2f2] text-right">2.1140</span>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-4 py-1 border-b border-[#262a35]/40 items-center">
              <span className="text-[#dfe2f2]">0.9125</span>
              <span className="text-[#089981] font-bold text-right pr-2">64,820.00</span>
              <span className="text-[#f23645] font-bold pl-2">64,822.80</span>
              <span className="text-[#dfe2f2] text-right">0.6800</span>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-4 py-1 items-center">
              <span className="text-[#dfe2f2]">3.2040</span>
              <span className="text-[#089981] font-bold text-right pr-2">64,818.50</span>
              <span className="text-[#f23645] font-bold pl-2">64,825.00</span>
              <span className="text-[#dfe2f2] text-right">4.0150</span>
            </div>
          </div>
        </div>

        {/* Key Fundamentals */}
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3.5 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#089981] text-[18px]">insights</span>
            <h3 className="font-bold text-[14px] text-[#dfe2f2]">Key Fundamentals</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
            <div className="bg-[#0a0e19] p-2.5 rounded-lg border border-[#262a35]">
              <span className="text-[#8d90a2] block text-[9px] uppercase">MARKET CAP</span>
              <span className="text-[#dfe2f2] font-bold text-[13px]">$1.28 Trillion</span>
              <span className="text-[#089981] text-[10px] block">Rank #1 Global</span>
            </div>

            <div className="bg-[#0a0e19] p-2.5 rounded-lg border border-[#262a35]">
              <span className="text-[#8d90a2] block text-[9px] uppercase">CIRCULATING SUPPLY</span>
              <span className="text-[#dfe2f2] font-bold text-[13px]">19.72M BTC</span>
              <span className="text-[#8d90a2] text-[10px] block">93.9% of 21M Total</span>
            </div>

            <div className="bg-[#0a0e19] p-2.5 rounded-lg border border-[#262a35]">
              <span className="text-[#8d90a2] block text-[9px] uppercase">ALL-TIME HIGH</span>
              <span className="text-[#dfe2f2] font-bold text-[13px]">$73,750.07</span>
              <span className="text-[#f23645] text-[10px] block">-12.1% from peak</span>
            </div>

            <div className="bg-[#0a0e19] p-2.5 rounded-lg border border-[#262a35] flex flex-col justify-between">
              <div>
                <span className="text-[#8d90a2] block text-[9px] uppercase">52-WEEK RANGE</span>
                <span className="text-[#dfe2f2] font-bold text-[12px]">$25.0K - $73.8K</span>
              </div>
              <div className="w-full h-1.5 bg-[#262a35] rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#089981] rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Historical Performance */}
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3.5 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#089981] text-[18px]">trending_up</span>
              <h3 className="font-bold text-[14px] text-[#dfe2f2]">Historical Performance</h3>
            </div>
            <span className="text-[10px] font-mono text-[#8d90a2] uppercase">
              TRAILING RETURNS
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-[#0a0e19] border border-[#262a35]">
              <span className="text-[9px] text-[#8d90a2] block">1 WEEK</span>
              <span className="text-[12px] font-bold text-[#089981]">+4.2%</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0a0e19] border border-[#262a35]">
              <span className="text-[9px] text-[#8d90a2] block">1 MONTH</span>
              <span className="text-[12px] font-bold text-[#089981]">+8.7%</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0a0e19] border border-[#262a35]">
              <span className="text-[9px] text-[#8d90a2] block">3 MONTH</span>
              <span className="text-[12px] font-bold text-[#089981]">+18.4%</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0a0e19] border border-[#262a35]">
              <span className="text-[9px] text-[#8d90a2] block">6 MONTH</span>
              <span className="text-[12px] font-bold text-[#089981]">+32.1%</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0a0e19] border border-[#262a35]">
              <span className="text-[9px] text-[#8d90a2] block">1 YEAR</span>
              <span className="text-[12px] font-bold text-[#089981]">+142.5%</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0a0e19] border border-[#262a35]">
              <span className="text-[9px] text-[#8d90a2] block">YTD</span>
              <span className="text-[12px] font-bold text-[#089981]">+58.9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1b1f2b]/95 backdrop-blur-xl border-t border-[#262a35] p-3 flex gap-2.5 max-w-lg mx-auto">
        <button
          onClick={() => {
            onClose();
            onGoToChart(item);
          }}
          className="flex-1 py-3 px-4 rounded-xl bg-[#262a35] hover:bg-[#313441] text-[#dfe2f2] font-semibold text-[14px] flex items-center justify-center gap-1.5 transition-colors border border-[#313441]"
        >
          <span className="material-symbols-outlined text-[18px]">show_chart</span>
          <span>Full Chart</span>
        </button>

        <button
          onClick={() => {
            onClose();
            onOpenTrade(item, 'buy', livePrice);
          }}
          className="flex-1 py-3 px-4 rounded-xl bg-[#2962ff] hover:bg-[#2962ff]/90 text-white font-semibold text-[14px] flex items-center justify-center gap-1.5 transition-colors shadow-lg"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Trade / Order</span>
        </button>
      </div>
    </div>
  );
};
