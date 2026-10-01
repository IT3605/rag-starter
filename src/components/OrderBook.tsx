import React, { useState, useEffect, useMemo } from 'react';
import { WatchlistItem } from '../types';

interface OrderBookProps {
  item: WatchlistItem;
  livePrice: number;
  onSelectPrice: (price: number, side: 'buy' | 'sell') => void;
}

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
  depthPct: number;
}

export const OrderBook: React.FC<OrderBookProps> = ({
  item,
  livePrice,
  onSelectPrice,
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'bids' | 'asks'>('both');
  const [precision, setPrecision] = useState<number>(item.decimals === 4 ? 0.0001 : 0.5);
  const [isExpanded, setIsExpanded] = useState(true);

  // Generate dynamic realistic order book levels anchored to current livePrice
  const rowCount = 6;

  const { asks, bids, spread, spreadPct } = useMemo(() => {
    const step = precision;
    const asksList: OrderBookLevel[] = [];
    const bidsList: OrderBookLevel[] = [];

    let askTotal = 0;
    for (let i = rowCount; i >= 1; i--) {
      const p = +(livePrice + i * step).toFixed(item.decimals);
      const size = +(Math.sin(p * 10) * 1.8 + 2.5 + (i * 0.4)).toFixed(item.decimals === 4 ? 2 : 3);
      askTotal += size;
      asksList.push({
        price: p,
        size,
        total: +askTotal.toFixed(3),
        depthPct: 0,
      });
    }

    // Compute max for depth bar percentages
    const maxAskTotal = askTotal || 1;
    asksList.forEach((a) => {
      a.depthPct = Math.min(100, Math.round((a.total / maxAskTotal) * 100));
    });

    let bidTotal = 0;
    for (let i = 1; i <= rowCount; i++) {
      const p = +(livePrice - i * step).toFixed(item.decimals);
      const size = +(Math.cos(p * 10) * 1.7 + 2.3 + (i * 0.35)).toFixed(item.decimals === 4 ? 2 : 3);
      bidTotal += size;
      bidsList.push({
        price: p,
        size,
        total: +bidTotal.toFixed(3),
        depthPct: 0,
      });
    }

    const maxBidTotal = bidTotal || 1;
    bidsList.forEach((b) => {
      b.depthPct = Math.min(100, Math.round((b.total / maxBidTotal) * 100));
    });

    const lowestAsk = asksList[asksList.length - 1]?.price || livePrice;
    const highestBid = bidsList[0]?.price || livePrice;
    const spr = Math.max(0, +(lowestAsk - highestBid).toFixed(item.decimals));
    const sprPct = livePrice > 0 ? +((spr / livePrice) * 100).toFixed(4) : 0;

    return {
      asks: asksList,
      bids: bidsList,
      spread: spr,
      spreadPct: sprPct,
    };
  }, [livePrice, precision, item.decimals]);

  return (
    <div className="w-full bg-[#171b26] border-t border-b border-[#262a35] flex flex-col select-none transition-all">
      {/* Order Book Header & Controls */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1b1f2b] text-[11px] font-mono border-b border-[#262a35]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 font-bold text-[#dfe2f2] hover:text-white"
          >
            <span className={`material-symbols-outlined text-[15px] text-[#2962ff] transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
              chevron_right
            </span>
            <span>Order Book & Depth</span>
          </button>
          <span className="text-[10px] text-[#8d90a2] hidden xs:inline">
            ({item.symbol.replace('/USDT', '')})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mode Switcher: All / Bids / Asks */}
          <div className="flex bg-[#0a0e19] p-0.5 rounded border border-[#262a35]">
            <button
              onClick={() => setViewMode('both')}
              title="Both Bids and Asks"
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                viewMode === 'both' ? 'bg-[#262a35] text-[#dfe2f2] font-bold' : 'text-[#8d90a2]'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setViewMode('bids')}
              title="Bids Only"
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                viewMode === 'bids' ? 'bg-[#089981]/20 text-[#089981] font-bold' : 'text-[#8d90a2]'
              }`}
            >
              Bids
            </button>
            <button
              onClick={() => setViewMode('asks')}
              title="Asks Only"
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                viewMode === 'asks' ? 'bg-[#f23645]/20 text-[#f23645] font-bold' : 'text-[#8d90a2]'
              }`}
            >
              Asks
            </button>
          </div>

          {/* Precision Selector */}
          <select
            value={precision}
            onChange={(e) => setPrecision(parseFloat(e.target.value))}
            className="bg-[#0a0e19] border border-[#262a35] text-[#b6c4ff] text-[10px] font-mono px-1.5 py-0.5 rounded focus:outline-none"
          >
            {item.decimals === 4 ? (
              <>
                <option value={0.0001}>0.0001</option>
                <option value={0.0005}>0.0005</option>
                <option value={0.001}>0.001</option>
              </>
            ) : (
              <>
                <option value={0.1}>0.1</option>
                <option value={0.5}>0.5</option>
                <option value={1.0}>1.0</option>
                <option value={5.0}>5.0</option>
              </>
            )}
          </select>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col px-3 py-1.5">
          {/* Column Header Titles */}
          <div className="grid grid-cols-3 text-[10px] font-mono text-[#8d90a2] pb-1 uppercase tracking-wider border-b border-[#262a35]/60">
            <span className="text-left">Price (USD)</span>
            <span className="text-right">Size</span>
            <span className="text-right">Total</span>
          </div>

          {/* Dual Columns vs Stacked Layout:
              If viewMode === 'both', we render a clean compact layout: Asks (top), Spread bar (center), Bids (bottom) */}
          <div className="flex flex-col divide-y divide-[#262a35]/30">
            {/* Asks (Sell Orders - descending red) */}
            {(viewMode === 'both' || viewMode === 'asks') && (
              <div className="flex flex-col py-0.5">
                {asks.slice(viewMode === 'asks' ? 0 : 2).map((ask, idx) => (
                  <div
                    key={`ask-${idx}`}
                    onClick={() => onSelectPrice(ask.price, 'sell')}
                    className="relative grid grid-cols-3 py-0.5 text-[11px] font-mono hover:bg-[#f23645]/10 cursor-pointer transition-colors group"
                  >
                    {/* Background Depth Fill Bar */}
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-[#f23645]/15 transition-all pointer-events-none"
                      style={{ width: `${ask.depthPct}%` }}
                    />
                    <span className="text-[#f23645] font-semibold text-left z-10 group-hover:underline">
                      {ask.price.toFixed(item.decimals)}
                    </span>
                    <span className="text-[#dfe2f2] text-right z-10 font-normal">
                      {ask.size}
                    </span>
                    <span className="text-[#8d90a2] text-right z-10">
                      {ask.total}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Live Spread Center Band */}
            {viewMode === 'both' && (
              <div className="flex items-center justify-between py-1 px-2 my-0.5 bg-[#0a0e19] rounded border border-[#262a35] text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[#8d90a2] text-[10px]">Spread:</span>
                  <span className="text-[#dfe2f2] font-bold">
                    {spread.toFixed(item.decimals)} ({spreadPct}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-[10px] text-[#8d90a2]">Last:</span>
                  <span className="text-[#089981]">
                    ${livePrice.toFixed(item.decimals)}
                  </span>
                </div>
              </div>
            )}

            {/* Bids (Buy Orders - green) */}
            {(viewMode === 'both' || viewMode === 'bids') && (
              <div className="flex flex-col py-0.5">
                {bids.slice(0, viewMode === 'bids' ? rowCount : 4).map((bid, idx) => (
                  <div
                    key={`bid-${idx}`}
                    onClick={() => onSelectPrice(bid.price, 'buy')}
                    className="relative grid grid-cols-3 py-0.5 text-[11px] font-mono hover:bg-[#089981]/10 cursor-pointer transition-colors group"
                  >
                    {/* Background Depth Fill Bar */}
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-[#089981]/15 transition-all pointer-events-none"
                      style={{ width: `${bid.depthPct}%` }}
                    />
                    <span className="text-[#089981] font-semibold text-left z-10 group-hover:underline">
                      {bid.price.toFixed(item.decimals)}
                    </span>
                    <span className="text-[#dfe2f2] text-right z-10 font-normal">
                      {bid.size}
                    </span>
                    <span className="text-[#8d90a2] text-right z-10">
                      {bid.total}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
