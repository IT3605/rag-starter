import React from 'react';
import { IndicatorSettings } from '../types';

interface IndicatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicators: IndicatorSettings;
  onChangeIndicators: (updated: IndicatorSettings) => void;
}

export const IndicatorsModal: React.FC<IndicatorsModalProps> = ({
  isOpen,
  onClose,
  indicators,
  onChangeIndicators,
}) => {
  if (!isOpen) return null;

  const toggle = (key: keyof IndicatorSettings) => {
    onChangeIndicators({
      ...indicators,
      [key]: !indicators[key],
    });
  };

  const indicatorList: { key: keyof IndicatorSettings; label: string; desc: string; color: string; defaultVal: string }[] = [
    { key: 'ema20', label: 'EMA (20, Close)', desc: 'Fast exponential moving average for short-term trend momentum', color: '#f59e0b', defaultVal: 'Length: 20' },
    { key: 'ema50', label: 'EMA (50, Close)', desc: 'Medium-term trend baseline and dynamic support filter', color: '#06b6d4', defaultVal: 'Length: 50' },
    { key: 'ema200', label: 'EMA (200, Close)', desc: 'Macro structural bull/bear division trendline', color: '#a855f7', defaultVal: 'Length: 200' },
    { key: 'volMa', label: 'Volume MA (20)', desc: 'Moving average on trading volume bars', color: '#66dabf', defaultVal: 'Length: 20' },
    { key: 'rsi', label: 'Relative Strength Index (RSI)', desc: 'Momentum oscillator with 70/30 overbought/oversold bands', color: '#b6c4ff', defaultVal: 'Period: 14' },
    { key: 'macd', label: 'MACD (12, 26, Close, 9)', desc: 'Moving Average Convergence Divergence with histogram', color: '#2962ff', defaultVal: 'Fast 12, Slow 26' },
    { key: 'bollinger', label: 'Bollinger Bands (20, 2)', desc: 'Volatility bands with 2 standard deviations', color: '#ec4899', defaultVal: 'Length 20, Mult 2' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 animate-fade-in">
      <div
        className="w-full max-w-md bg-[#171b26] border border-[#262a35] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 bg-[#1b1f2b] border-b border-[#262a35] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#b6c4ff] font-serif font-bold italic text-[16px]">fx</span>
            <h3 className="font-bold text-[15px] text-[#dfe2f2]">Technical Indicators</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#262a35]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-2.5 overflow-y-auto">
          {indicatorList.map((ind) => {
            const isEnabled = indicators[ind.key];
            return (
              <div
                key={ind.key}
                onClick={() => toggle(ind.key)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isEnabled
                    ? 'bg-[#1b1f2b] border-[#313441] shadow-sm'
                    : 'bg-[#0a0e19]/60 border-transparent hover:bg-[#1b1f2b]/50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: ind.color }}
                  />
                  <div className="flex flex-col">
                    <span className="font-mono text-[13px] text-[#dfe2f2] font-semibold">
                      {ind.label}
                    </span>
                    <span className="text-[11px] text-[#8d90a2] mt-0.5 leading-tight">
                      {ind.desc}
                    </span>
                    <span className="font-mono text-[10px] text-[#b6c4ff]/80 mt-1">
                      {ind.defaultVal}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors shrink-0 ml-2 ${
                    isEnabled ? 'bg-[#2962ff]' : 'bg-[#313441]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-3 bg-[#1b1f2b] border-t border-[#262a35] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2962ff] text-white text-[12px] font-semibold rounded-lg hover:bg-[#2962ff]/90 transition-colors shadow"
          >
            Apply to Chart
          </button>
        </div>
      </div>
    </div>
  );
};
