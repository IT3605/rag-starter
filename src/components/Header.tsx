import React from 'react';

interface HeaderProps {
  currentTab: string;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadAlertsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSearch,
  onOpenNotifications,
  onOpenProfile,
  unreadAlertsCount = 2,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'watchlist': return 'Watchlist';
      case 'chart': return 'Chart';
      case 'ideas': return 'Ideas';
      case 'news': return 'News';
      case 'menu': return 'Terminal';
      default: return 'Watchlist';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#1b1f2b]/95 backdrop-blur-xl border-b border-[#262a35] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-14 px-3 flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: TV Logo & Current Screen Title */}
        <div className="flex items-center gap-2 shrink-0">
          <img
            alt="TradingView Logo"
            className="h-8 w-auto object-contain cursor-pointer transition-transform hover:scale-105 active:scale-95"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XVNRnbYGVTHQL2KmC_tJPbbKmBVFUFLIiiS2e3atio7zWvftj8GLEjR_7ohxbqeycejMLM4pNmcgevRL42G3jefS0nqCuFbyI_8kivf39mhO_uRARVxXXhE0npsQ077dtde3V8ofPoYRiUMC-kNsiu1FzZStrD9CdD7W9joGSBy3wmgHLaUbh3LcBLrXzkBn-3ALSi4nwxWFLm8b92zJ4FlOJpI8EMTSrRpRVDPiZIzTd6gpH9eOFuCQ"
            onClick={onOpenSearch}
          />
          <span className="font-semibold text-[17px] text-[#dfe2f2] tracking-tight hidden xs:inline-block">
            {getTabTitle()}
          </span>
        </div>

        {/* Center: Search Field */}
        <div
          onClick={onOpenSearch}
          className="flex-1 max-w-[210px] sm:max-w-xs flex items-center bg-[#0a0e19]/90 border border-[#262a35] hover:border-[#8d90a2]/40 rounded-lg px-2.5 py-1 gap-1.5 h-9 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[#8d90a2] text-[18px]">search</span>
          <span className="font-mono text-[12px] text-[#8d90a2] truncate uppercase select-none">
            BTCUSDT, AAPL...
          </span>
          <span className="hidden sm:inline-block ml-auto text-[10px] font-mono text-[#8d90a2]/60 px-1 py-0.2 rounded border border-[#262a35]">
            ⌘K
          </span>
        </div>

        {/* Right: Notifications & Profile Avatar */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            aria-label="Alerts"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 flex items-center justify-center text-[#c3c5d8] hover:text-[#dfe2f2] hover:bg-[#262a35]/60 active:scale-95 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadAlertsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f23645] ring-2 ring-[#1b1f2b]" />
            )}
          </button>

          <button
            aria-label="User Profile"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-[#b6c4ff] hover:opacity-90 active:scale-95 flex items-center justify-center shrink-0 transition-transform shadow-sm ml-0.5"
          >
            <span className="material-symbols-outlined text-[#002780] text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
