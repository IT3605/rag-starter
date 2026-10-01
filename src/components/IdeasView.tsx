import React, { useState } from 'react';
import { MOCK_TRADE_IDEAS } from '../data/mockData';
import { TradeIdea } from '../types';

interface IdeasViewProps {
  onSelectSymbolForChart: (symbol: string) => void;
  onTradeSetup: (idea: TradeIdea) => void;
}

export const IdeasView: React.FC<IdeasViewProps> = ({
  onSelectSymbolForChart,
  onTradeSetup,
}) => {
  const [filter, setFilter] = useState<'All' | 'Bullish' | 'Bearish'>('All');
  const [ideas, setIdeas] = useState(MOCK_TRADE_IDEAS);

  const toggleLike = (id: string) => {
    setIdeas(
      ideas.map((idea) =>
        idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea
      )
    );
  };

  const filteredIdeas = ideas.filter(
    (item) => filter === 'All' || item.sentiment === filter
  );

  return (
    <div className="flex flex-col w-full select-none pb-24 px-3 pt-3">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-[17px] font-bold text-[#dfe2f2] tracking-tight">Trading Ideas & Alpha</h2>
          <p className="text-[11px] text-[#8d90a2]">Institutional analysis, setups and community signals</p>
        </div>
        <div className="flex gap-1 bg-[#1b1f2b] p-1 rounded-lg border border-[#262a35]">
          {(['All', 'Bullish', 'Bearish'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                filter === f
                  ? 'bg-[#262a35] text-[#b6c4ff] font-bold'
                  : 'text-[#8d90a2] hover:text-[#dfe2f2]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Feed */}
      <div className="flex flex-col gap-3">
        {filteredIdeas.map((idea) => {
          const isBull = idea.sentiment === 'Bullish';
          return (
            <div
              key={idea.id}
              className="bg-[#1b1f2b] border border-[#262a35] rounded-xl p-3.5 flex flex-col gap-2.5 hover:border-[#313441] transition-all shadow-md"
            >
              {/* Author & Symbol Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={idea.authorAvatar}
                    alt={idea.author}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#313441]"
                  />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[#dfe2f2]">{idea.author}</span>
                    <span className="text-[10px] text-[#8d90a2]">{idea.timeAgo}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    onClick={() => onSelectSymbolForChart(idea.symbol)}
                    className="px-2 py-0.5 rounded bg-[#262a35] hover:bg-[#313441] text-[#b6c4ff] font-mono text-[11px] font-bold cursor-pointer border border-[#313441]"
                  >
                    {idea.symbol} • {idea.timeframe}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isBull ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#f23645]/20 text-[#f23645]'
                    }`}
                  >
                    {idea.sentiment}
                  </span>
                </div>
              </div>

              {/* Title & Summary */}
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-[14px] text-[#dfe2f2] leading-snug">
                  {idea.title}
                </h3>
                <p className="text-[12px] text-[#c3c5d8] leading-relaxed">
                  {idea.summary}
                </p>
              </div>

              {/* Setup Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 bg-[#0a0e19] p-2.5 rounded-lg border border-[#262a35] font-mono text-[11px]">
                <div>
                  <span className="text-[#8d90a2] block text-[9px] uppercase">Entry</span>
                  <span className="text-[#dfe2f2] font-semibold">${idea.entryPrice.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#089981] block text-[9px] uppercase">Target (TP)</span>
                  <span className="text-[#089981] font-semibold">${idea.targetPrice.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#f23645] block text-[9px] uppercase">Stop Loss (SL)</span>
                  <span className="text-[#f23645] font-semibold">${idea.stopLoss.toLocaleString()}</span>
                </div>
              </div>

              {/* Action buttons: Like, Comment, Trade Now */}
              <div className="flex items-center justify-between pt-1 border-t border-[#262a35]/60">
                <div className="flex items-center gap-3 text-[#8d90a2] text-[12px]">
                  <button
                    onClick={() => toggleLike(idea.id)}
                    className="flex items-center gap-1 hover:text-[#ffb3b0] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                    <span>{idea.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-[#dfe2f2] transition-colors">
                    <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                    <span>{idea.comments}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectSymbolForChart(idea.symbol)}
                    className="px-2.5 py-1 text-[11px] font-mono rounded bg-[#262a35] hover:bg-[#313441] text-[#c3c5d8] transition-colors"
                  >
                    Open Chart
                  </button>
                  <button
                    onClick={() => onTradeSetup(idea)}
                    className="px-3 py-1 text-[11px] font-semibold rounded bg-[#2962ff] hover:bg-[#2962ff]/90 text-white transition-colors shadow"
                  >
                    Copy Setup
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
