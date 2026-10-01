import React, { useState } from 'react';
import { WatchlistItem, Position } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  side: 'buy' | 'sell';
  symbolItem: WatchlistItem;
  currentPrice: number;
  onClose: () => void;
  onExecuteOrder: (pos: Position) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  side,
  symbolItem,
  currentPrice,
  onClose,
  onExecuteOrder,
}) => {
  const [orderType, setOrderType] = useState<'Market' | 'Limit' | 'Stop'>('Market');
  const [limitPrice, setLimitPrice] = useState(currentPrice.toString());
  const [amount, setAmount] = useState('0.25');
  const [leverage, setLeverage] = useState(20);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const isBuy = side === 'buy';
  const effectivePrice = orderType === 'Market' ? currentPrice : parseFloat(limitPrice) || currentPrice;
  const numAmount = parseFloat(amount) || 0;
  const totalValue = numAmount * effectivePrice;
  const marginRequired = totalValue / leverage;

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setOrderSuccess(true);
      const newPos: Position = {
        id: `pos-${Date.now()}`,
        symbol: symbolItem.symbol,
        side: isBuy ? 'Buy / Long' : 'Sell / Short',
        entryPrice: effectivePrice,
        markPrice: effectivePrice,
        amount: numAmount,
        leverage,
        pnl: 0,
        pnlPct: 0,
      };
      onExecuteOrder(newPos);
      setTimeout(() => {
        setOrderSuccess(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div
        className="w-full sm:max-w-md bg-[#171b26] border border-[#262a35] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#1b1f2b] border-b border-[#262a35] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                isBuy ? 'bg-[#089981] text-white' : 'bg-[#f23645] text-white'
              }`}
            >
              {isBuy ? 'Buy / Long' : 'Sell / Short'}
            </span>
            <span className="font-bold text-[15px] text-[#dfe2f2]">
              {symbolItem.symbol}
            </span>
            <span className="text-[11px] text-[#8d90a2] font-mono">
              ${currentPrice.toFixed(symbolItem.decimals)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#262a35]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {orderSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#089981]/20 border border-[#089981] flex items-center justify-center text-[#089981] animate-bounce">
              <span className="material-symbols-outlined text-[36px]">check</span>
            </div>
            <h3 className="font-bold text-[18px] text-[#dfe2f2]">Order Filled Successfully!</h3>
            <p className="text-[12px] text-[#8d90a2] font-mono">
              {isBuy ? 'Long' : 'Short'} {amount} {symbolItem.symbol} @ ${effectivePrice.toFixed(symbolItem.decimals)}
            </p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-3.5 overflow-y-auto">
            {/* Order Type Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#0a0e19] p-1 rounded-lg border border-[#262a35]">
              {(['Market', 'Limit', 'Stop'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`py-1.5 text-[11px] font-mono font-medium rounded transition-colors ${
                    orderType === type
                      ? 'bg-[#262a35] text-[#b6c4ff] shadow-sm font-bold'
                      : 'text-[#8d90a2] hover:text-[#dfe2f2]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Price Input if not Market */}
            {orderType !== 'Market' && (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-mono text-[#8d90a2]">Order Price (USD)</label>
                <div className="flex items-center bg-[#0a0e19] border border-[#262a35] rounded-lg px-3 py-1.5 focus-within:border-[#2962ff]">
                  <input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="bg-transparent font-mono text-[13px] text-[#dfe2f2] w-full focus:outline-none"
                    placeholder="0.00"
                  />
                  <span className="text-[11px] font-mono text-[#8d90a2]">USD</span>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-[#8d90a2]">Order Size</span>
                <span className="text-[#c3c5d8]">Avail: 124,580.40 USDT</span>
              </div>
              <div className="flex items-center bg-[#0a0e19] border border-[#262a35] rounded-lg px-3 py-1.5 focus-within:border-[#2962ff]">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent font-mono text-[13px] text-[#dfe2f2] w-full focus:outline-none"
                  placeholder="0.0"
                  step="0.05"
                />
                <span className="text-[11px] font-mono text-[#8d90a2]">{symbolItem.symbol.replace('/USDT', '')}</span>
              </div>
              {/* Size Shortcut Buttons */}
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {['0.1', '0.25', '0.5', '1.0'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className="py-1 text-[10px] font-mono bg-[#1b1f2b] hover:bg-[#262a35] text-[#c3c5d8] rounded border border-[#262a35]"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Leverage Slider */}
            <div className="flex flex-col gap-1.5 bg-[#1b1f2b] p-3 rounded-lg border border-[#262a35]">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-[#8d90a2]">Leverage:</span>
                <span className="text-[#b6c4ff] font-bold px-2 py-0.5 rounded bg-[#262a35]">
                  {leverage}x Cross
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full accent-[#2962ff] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#8d90a2] font-mono">
                <span>1x</span>
                <span>20x</span>
                <span>50x</span>
                <span>100x</span>
              </div>
            </div>

            {/* TP / SL Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-[#089981]">Take Profit (TP)</label>
                <input
                  type="number"
                  placeholder={`> ${effectivePrice.toFixed(2)}`}
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="bg-[#0a0e19] border border-[#262a35] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-[#dfe2f2] focus:outline-none focus:border-[#089981]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-[#f23645]">Stop Loss (SL)</label>
                <input
                  type="number"
                  placeholder={`< ${effectivePrice.toFixed(2)}`}
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="bg-[#0a0e19] border border-[#262a35] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-[#dfe2f2] focus:outline-none focus:border-[#f23645]"
                />
              </div>
            </div>

            {/* Margin & Liquidation Calculation Summary */}
            <div className="bg-[#0a0e19] p-3 rounded-lg border border-[#262a35] flex flex-col gap-1 text-[11px] font-mono">
              <div className="flex justify-between text-[#8d90a2]">
                <span>Order Notional Value:</span>
                <span className="text-[#dfe2f2]">${totalValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#8d90a2]">
                <span>Initial Margin:</span>
                <span className="text-[#b6c4ff] font-semibold">${marginRequired.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#8d90a2]">
                <span>Est. Liquidation Price:</span>
                <span className="text-[#f23645]">
                  ${(isBuy ? effectivePrice * (1 - 0.9 / leverage) : effectivePrice * (1 + 0.9 / leverage)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={isExecuting || numAmount <= 0}
              className={`w-full py-3 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 text-white shadow-xl transition-all cursor-pointer ${
                isBuy
                  ? 'bg-[#089981] hover:bg-[#089981]/90 active:scale-[0.98]'
                  : 'bg-[#f23645] hover:bg-[#f23645]/90 active:scale-[0.98]'
              } disabled:opacity-50`}
            >
              {isExecuting ? (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Transmitting Order...</span>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    {isBuy ? 'arrow_upward' : 'arrow_downward'}
                  </span>
                  <span>
                    Execute {isBuy ? 'Buy / Long' : 'Sell / Short'} (${marginRequired.toFixed(2)})
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
