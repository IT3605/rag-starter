import React, { useState } from 'react';
import { MOCK_NEWS } from '../data/mockData';

export const NewsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const categories = ['ALL', 'Macro', 'Crypto', 'Stocks', 'Forex'];

  const filteredNews = MOCK_NEWS.filter(
    (item) => activeCategory === 'ALL' || item.category === activeCategory
  );

  return (
    <div className="flex flex-col w-full select-none pb-24 px-3 pt-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-[17px] font-bold text-[#dfe2f2] tracking-tight">Market News & Wire</h2>
          <p className="text-[11px] text-[#8d90a2]">Institutional headlines and economic catalysts</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-[#089981] bg-[#089981]/10 px-2 py-1 rounded border border-[#089981]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-pulse" />
          <span>LIVE WIRE</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-colors border ${
              activeCategory === cat
                ? 'bg-[#2962ff] text-white border-[#2962ff] font-semibold'
                : 'bg-[#1b1f2b] text-[#8d90a2] border-[#262a35] hover:text-[#dfe2f2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Economic Calendar Quick Strip */}
      <div className="my-2.5 p-3 rounded-xl bg-[#171b26] border border-[#262a35] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="font-bold text-[#dfe2f2] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#f59e0b]">event</span>
            Upcoming High-Impact Catalysts
          </span>
          <span className="text-[#8d90a2]">Today</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="p-2 bg-[#0a0e19] rounded-lg border border-[#262a35]">
            <span className="text-[#f23645] font-bold">14:30 EST • Core CPI YoY</span>
            <span className="block text-[#8d90a2] text-[10px]">Forecast: 3.2% | Prev: 3.4%</span>
          </div>
          <div className="p-2 bg-[#0a0e19] rounded-lg border border-[#262a35]">
            <span className="text-[#f59e0b] font-bold">16:00 EST • Fed Chair Speech</span>
            <span className="block text-[#8d90a2] text-[10px]">Monetary Policy Remarks</span>
          </div>
        </div>
      </div>

      {/* News Items List */}
      <div className="flex flex-col gap-2.5">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="p-3.5 bg-[#1b1f2b] border border-[#262a35] rounded-xl flex flex-col gap-1.5 hover:border-[#313441] transition-colors"
          >
            <div className="flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[#b6c4ff] font-bold">{news.source}</span>
                <span className="text-[#8d90a2]">•</span>
                <span className="text-[#8d90a2]">{news.timeAgo}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#262a35] text-[#8d90a2] uppercase">
                {news.category}
              </span>
            </div>

            <h3 className="font-semibold text-[13px] text-[#dfe2f2] leading-snug">
              {news.title}
            </h3>

            <p className="text-[12px] text-[#8d90a2] leading-relaxed">
              {news.summary}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-[#262a35]/60 text-[10px] font-mono text-[#8d90a2]">
              <span>{news.readTime}</span>
              <span
                className={`font-semibold ${
                  news.sentiment === 'Bullish' ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                ● Sentiment: {news.sentiment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
