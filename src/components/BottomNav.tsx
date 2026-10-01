import React from 'react';

export type TabKey = 'watchlist' | 'markets' | 'chart' | 'ideas' | 'menu';

interface BottomNavProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'watchlist', label: 'Watchlist', icon: 'format_list_bulleted' },
    { key: 'markets', label: 'Markets', icon: 'show_chart' },
    { key: 'chart', label: 'Chart', icon: 'candlestick_chart' },
    { key: 'ideas', label: 'Ideas', icon: 'lightbulb' },
    { key: 'menu', label: 'Menu', icon: 'menu' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#1b1f2b]/95 backdrop-blur-xl border-t border-[#262a35] shadow-[0_-1px_12px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={`flex flex-col items-center justify-center w-14 h-11 transition-all duration-150 gap-0.5 relative active:scale-95 ${
                isActive
                  ? 'text-[#2962ff] font-semibold'
                  : 'text-[#8d90a2] hover:text-[#dfe2f2]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-[2px] rounded-full bg-[#2962ff]" />
              )}
              <span className={`material-symbols-outlined text-[20px] transition-transform ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[10px] tracking-wider uppercase font-sans font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
