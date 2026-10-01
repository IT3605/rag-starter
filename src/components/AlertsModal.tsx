import React, { useState } from 'react';
import { WatchlistItem } from '../types';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSymbol?: WatchlistItem;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  activeSymbol,
}) => {
  const [alerts, setAlerts] = useState([
    { id: '1', symbol: 'BTCUSDT', target: 68500, condition: 'Crossing Up', active: true },
    { id: '2', symbol: 'ETHUSDT', target: 3350, condition: 'Crossing Down', active: true },
    { id: '3', symbol: 'NVDA', target: 135, condition: 'Crossing Up', active: false },
  ]);
  const [newTarget, setNewTarget] = useState(activeSymbol ? (activeSymbol.price * 1.05).toFixed(2) : '65000');
  const [condition, setCondition] = useState<'Crossing Up' | 'Crossing Down'>('Crossing Up');

  if (!isOpen) return null;

  const handleAddAlert = () => {
    if (!newTarget) return;
    const item: (typeof alerts)[0] = {
      id: `alert-${Date.now()}`,
      symbol: activeSymbol ? activeSymbol.symbol : 'BTCUSDT',
      target: parseFloat(newTarget) || 0,
      condition,
      active: true,
    };
    setAlerts([item, ...alerts]);
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 animate-fade-in">
      <div
        className="w-full max-w-md bg-[#171b26] border border-[#262a35] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 bg-[#1b1f2b] border-b border-[#262a35] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb3b0] text-[20px]">add_alert</span>
            <h3 className="font-bold text-[15px] text-[#dfe2f2]">Market Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#262a35]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Add Alert form */}
        <div className="p-4 bg-[#0a0e19] border-b border-[#262a35] flex flex-col gap-2.5">
          <span className="text-[11px] font-mono text-[#8d90a2] uppercase tracking-wider">
            Create Alert for {activeSymbol ? activeSymbol.symbol : 'BTCUSDT'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as any)}
              className="bg-[#1b1f2b] border border-[#262a35] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-[#dfe2f2] focus:outline-none"
            >
              <option value="Crossing Up">Crossing Up</option>
              <option value="Crossing Down">Crossing Down</option>
            </select>
            <input
              type="number"
              placeholder="Target Price"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="bg-[#1b1f2b] border border-[#262a35] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-[#dfe2f2] focus:outline-none focus:border-[#2962ff]"
            />
          </div>
          <button
            onClick={handleAddAlert}
            className="w-full py-2 bg-[#2962ff] text-white text-[12px] font-semibold rounded-lg hover:bg-[#2962ff]/90 transition-colors shadow"
          >
            Set Price Trigger
          </button>
        </div>

        {/* Active Alerts List */}
        <div className="p-4 flex flex-col gap-2 overflow-y-auto max-h-[40vh]">
          <span className="text-[11px] font-mono text-[#8d90a2]">Active Triggers ({alerts.length})</span>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 bg-[#1b1f2b] border border-[#262a35] rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    alert.active ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#262a35] text-[#8d90a2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {alert.active ? 'notifications_active' : 'notifications_off'}
                  </span>
                </button>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 font-mono text-[12px]">
                    <span className="font-bold text-[#dfe2f2]">{alert.symbol}</span>
                    <span className="text-[#8d90a2]">{alert.condition}</span>
                    <span className="text-[#b6c4ff] font-bold">${alert.target.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-[#8d90a2]">
                    Status: {alert.active ? 'Arming on server' : 'Paused'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => removeAlert(alert.id)}
                className="w-6 h-6 rounded flex items-center justify-center text-[#8d90a2] hover:text-[#f23645]"
              >
                <span className="material-symbols-outlined text-[15px]">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
