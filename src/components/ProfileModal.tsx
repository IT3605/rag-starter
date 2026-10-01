import React, { useState } from 'react';
import { Position } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  positions: Position[];
  onClosePosition: (id: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  positions,
  onClosePosition,
}) => {
  const [activeTab, setActiveTab] = useState<'positions' | 'settings'>('positions');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  if (!isOpen) return null;

  const totalUnrealizedPnl = positions.reduce((acc, p) => acc + p.pnl, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 animate-fade-in">
      <div
        className="w-full max-w-md bg-[#171b26] border border-[#262a35] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Card Header */}
        <div className="p-4 bg-[#1b1f2b] border-b border-[#262a35] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#b6c4ff] flex items-center justify-center text-[#002780] shadow">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[14px] text-[#dfe2f2]">TraderDesk_Alpha</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#089981]/20 text-[#089981] font-mono font-semibold">
                  PRO VIP
                </span>
              </div>
              <span className="text-[11px] text-[#8d90a2] font-mono">UID: 84920194 • Binance Cross</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#262a35]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Portfolio Balance Stats */}
        <div className="p-4 bg-[#0a0e19] border-b border-[#262a35] grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-[#8d90a2]">Total Portfolio Value</span>
            <span className="font-mono text-[18px] font-bold text-[#dfe2f2]">
              $124,580.40 <span className="text-[11px] text-[#8d90a2] font-normal">USDT</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-[#8d90a2]">Unrealized PnL</span>
            <span
              className={`font-mono text-[16px] font-bold ${
                totalUnrealizedPnl >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              {totalUnrealizedPnl >= 0 ? '+' : ''}${totalUnrealizedPnl.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#262a35] bg-[#1b1f2b]">
          <button
            onClick={() => setActiveTab('positions')}
            className={`flex-1 py-2.5 text-[12px] font-mono font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'positions'
                ? 'border-[#2962ff] text-[#2962ff] bg-[#262a35]/40'
                : 'border-transparent text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
          >
            Open Positions ({positions.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2.5 text-[12px] font-mono font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-[#2962ff] text-[#2962ff] bg-[#262a35]/40'
                : 'border-transparent text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto max-h-[45vh]">
          {activeTab === 'positions' ? (
            positions.length === 0 ? (
              <div className="py-10 text-center text-[#8d90a2] font-mono text-[12px]">
                No active positions. Execute orders on the Chart screen.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {positions.map((pos) => {
                  const isLong = pos.side.includes('Long');
                  return (
                    <div
                      key={pos.id}
                      className="p-3 bg-[#1b1f2b] border border-[#262a35] rounded-xl flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-mono text-[13px] font-bold">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              isLong ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#f23645]/20 text-[#f23645]'
                            }`}
                          >
                            {pos.side}
                          </span>
                          <span className="text-[#dfe2f2]">{pos.symbol}</span>
                          <span className="text-[10px] text-[#b6c4ff] px-1 rounded bg-[#262a35]">
                            {pos.leverage}x
                          </span>
                        </div>
                        <button
                          onClick={() => onClosePosition(pos.id)}
                          className="px-2 py-0.5 text-[10px] font-mono text-[#f23645] hover:bg-[#f23645]/20 rounded border border-[#f23645]/40"
                        >
                          Market Close
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                        <div>
                          <span className="text-[#8d90a2] block text-[9px]">Entry Price</span>
                          <span className="text-[#dfe2f2]">${pos.entryPrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[#8d90a2] block text-[9px]">Size</span>
                          <span className="text-[#dfe2f2]">{pos.amount}</span>
                        </div>
                        <div>
                          <span className="text-[#8d90a2] block text-[9px]">Unrealized PnL</span>
                          <span
                            className={`font-bold ${pos.pnl >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}
                          >
                            {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)} ({pos.pnlPct.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Settings */
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 bg-[#1b1f2b] rounded-xl border border-[#262a35]">
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-[#dfe2f2]">Sound Effects & Ticks</span>
                  <span className="text-[11px] text-[#8d90a2]">Audio cues upon order fills & alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#2962ff]"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#1b1f2b] rounded-xl border border-[#262a35]">
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-[#dfe2f2]">Haptic Vibration</span>
                  <span className="text-[11px] text-[#8d90a2]">Tactile feedback when clicking buttons</span>
                </div>
                <input
                  type="checkbox"
                  checked={hapticEnabled}
                  onChange={(e) => setHapticEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#2962ff]"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#1b1f2b] rounded-xl border border-[#262a35]">
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-[#dfe2f2]">Theme Architecture</span>
                  <span className="text-[11px] text-[#8d90a2]">Obsidian Dark Spectrum</span>
                </div>
                <span className="text-[11px] font-mono text-[#66dabf] px-2 py-0.5 rounded bg-[#66dabf]/10">
                  Active
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
