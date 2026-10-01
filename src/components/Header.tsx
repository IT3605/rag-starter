import React, { useState } from 'react';
import { Language, TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenSystemAlerts: () => void;
  onOpenFeedback: () => void;
  onOpenFares: () => void;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  savedBookmarksCount: number;
  onOpenBookmarks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSelectLang,
  onOpenSystemAlerts,
  onOpenFeedback,
  onOpenFares,
  activeNav,
  onSelectNav,
  savedBookmarksCount,
  onOpenBookmarks,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const t = TRANSLATIONS[currentLang];

  const handleNavClick = (nav: string) => {
    onSelectNav(nav);
    if (nav === 'travel-alerts') onOpenSystemAlerts();
    if (nav === 'fares-and-concessions') onOpenFares();
    if (nav === 'feedback') onOpenFeedback();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Advisory Strip */}
      <div className="w-full bg-[#D9381E] text-white py-space-xs px-margin">
        <div className="w-full flex items-center justify-between gap-space-md max-w-7xl mx-auto">
          <div className="flex items-center gap-space-sm overflow-hidden">
            <span className="material-symbols-outlined text-[16px] text-white shrink-0">warning</span>
            <span className="font-label-sm uppercase tracking-wider bg-[#a01400] px-space-xs py-space-2xs rounded text-white shrink-0">
              Advisory
            </span>
            <p className="font-body-sm truncate text-white">
              {t.advisoryText}
            </p>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <button
              onClick={onOpenSystemAlerts}
              className="font-label-sm hover:underline text-white flex items-center gap-1 cursor-pointer"
            >
              <span>{t.viewSystemAlerts}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="w-full px-margin h-20 flex items-center justify-between gap-space-lg max-w-7xl mx-auto">
        <div className="flex items-center gap-space-lg shrink-0">
          <button
            onClick={() => onSelectNav('live-arrivals')}
            className="flex items-center gap-space-md text-left cursor-pointer focus:outline-none"
          >
            <img
              alt="SBS Transit Live Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WsqjoFfzLwnM-a9qKh4Ol7Q_vx2lBXZ6oLBiZWJ1nnuyIR8ZqaWRemCNKj52uJGrxxbwYh044pOybx-SsuY-iLqM6JK1mu_krn5zptl4X99JVixq0LHMpYau1IMCmaPXaFS6nuuCNXjJonK7qH7YbWjnzu5pho0CQxqDSmeYi6iLm-WiThfP8W-WNhxdY5fZCNCfUZyuGGjMFcJu54e6VrU2jNjXrDp8dAe6iKILyCM4seiVjmxV1hSg"
              onError={(e) => {
                // High-fidelity fallback SVG
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="font-headline-sm font-bold text-[#5c0088] leading-tight">SBS Transit</span>
              <span className="font-label-sm text-[#64748B] uppercase tracking-wider">{t.portalName}</span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-space-xs">
          <button
            onClick={() => handleNavClick('bus-services-and-routes')}
            className={`px-space-md py-space-sm font-label-md cursor-pointer transition-colors ${
              activeNav === 'bus-services-and-routes'
                ? 'bg-[#7a1cac] text-white font-semibold rounded-lg'
                : 'text-[#4e4352] hover:text-[#1a1b22] hover:bg-[#eeedf7]'
            }`}
          >
            {t.busServicesRoutes}
          </button>
          <button
            onClick={() => handleNavClick('live-arrivals')}
            className={`px-space-md py-space-sm font-label-md cursor-pointer transition-colors ${
              activeNav === 'live-arrivals'
                ? 'bg-[#7a1cac] text-white font-semibold rounded-lg shadow-sm'
                : 'text-[#4e4352] hover:text-[#1a1b22] hover:bg-[#eeedf7]'
            }`}
          >
            {t.liveArrivals}
          </button>
          <button
            onClick={() => handleNavClick('mrt-and-lrt')}
            className={`px-space-md py-space-sm font-label-md cursor-pointer transition-colors ${
              activeNav === 'mrt-and-lrt'
                ? 'bg-[#7a1cac] text-white font-semibold rounded-lg'
                : 'text-[#4e4352] hover:text-[#1a1b22] hover:bg-[#eeedf7]'
            }`}
          >
            {t.mrtLrt}
          </button>
          <button
            onClick={() => handleNavClick('travel-alerts')}
            className={`px-space-md py-space-sm font-label-md cursor-pointer transition-colors ${
              activeNav === 'travel-alerts'
                ? 'bg-[#7a1cac] text-white font-semibold rounded-lg'
                : 'text-[#4e4352] hover:text-[#1a1b22] hover:bg-[#eeedf7]'
            }`}
          >
            {t.travelAlerts}
          </button>
          <button
            onClick={() => handleNavClick('fares-and-concessions')}
            className={`px-space-md py-space-sm font-label-md cursor-pointer transition-colors ${
              activeNav === 'fares-and-concessions'
                ? 'bg-[#7a1cac] text-white font-semibold rounded-lg'
                : 'text-[#4e4352] hover:text-[#1a1b22] hover:bg-[#eeedf7]'
            }`}
          >
            {t.faresConcessions}
          </button>
          <button
            onClick={() => handleNavClick('feedback')}
            className={`px-space-md py-space-sm font-label-md cursor-pointer transition-colors ${
              activeNav === 'feedback'
                ? 'bg-[#7a1cac] text-white font-semibold rounded-lg'
                : 'text-[#4e4352] hover:text-[#1a1b22] hover:bg-[#eeedf7]'
            }`}
          >
            {t.feedback}
          </button>
        </nav>

        {/* Right Tools: Language Picker & Profile / Bookmarks */}
        <div className="flex items-center gap-space-md shrink-0 relative">
          <div className="hidden md:flex items-center bg-[#e8e7f1] rounded-full px-space-sm py-space-2xs">
            <button
              onClick={() => onSelectLang('en')}
              className={`px-space-xs py-space-2xs font-label-sm cursor-pointer transition-colors ${
                currentLang === 'en' ? 'text-[#5c0088] font-bold' : 'text-[#4e4352] hover:text-[#1a1b22]'
              }`}
            >
              English
            </button>
            <span className="text-[#d1c2d4] font-label-sm">|</span>
            <button
              onClick={() => onSelectLang('zh')}
              className={`px-space-xs py-space-2xs font-label-sm cursor-pointer transition-colors ${
                currentLang === 'zh' ? 'text-[#5c0088] font-bold' : 'text-[#4e4352] hover:text-[#1a1b22]'
              }`}
            >
              中文
            </button>
            <span className="text-[#d1c2d4] font-label-sm">|</span>
            <button
              onClick={() => onSelectLang('ta')}
              className={`px-space-xs py-space-2xs font-label-sm cursor-pointer transition-colors ${
                currentLang === 'ta' ? 'text-[#5c0088] font-bold' : 'text-[#4e4352] hover:text-[#1a1b22]'
              }`}
            >
              Tamil
            </button>
          </div>

          {/* Bookmark Quick Badge */}
          <button
            onClick={onOpenBookmarks}
            title="Bookmarked Services"
            className="relative p-2 text-[#64748B] hover:text-[#5c0088] hover:bg-[#eeedf7] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            {savedBookmarksCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#5c0088] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {savedBookmarksCount}
              </span>
            )}
          </button>

          {/* User Profile Button */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full bg-[#5c0088] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              aria-label="User Account"
            >
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-space-md z-50 animate-in fade-in duration-150">
                <div className="flex items-center gap-space-sm pb-space-sm border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-[#f5d9ff] text-[#5c0088] flex items-center justify-center font-bold">
                    SG
                  </div>
                  <div>
                    <p className="font-label-md text-slate-900">Commuter Profile</p>
                    <p className="font-body-sm text-[#64748B]">SimplyGo Concession Card</p>
                  </div>
                </div>

                <div className="py-space-sm space-y-1">
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-500">Card Balance</span>
                    <span className="font-bold text-slate-800 tabular-nums">$18.40</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-500">Concession Tier</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Adult Monthly</span>
                  </div>
                </div>

                <div className="pt-space-xs border-t border-slate-100 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenBookmarks();
                    }}
                    className="text-left text-xs text-slate-700 hover:text-[#5c0088] py-1.5 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">bookmark</span>
                    <span>Saved Routes ({savedBookmarksCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenFares();
                    }}
                    className="text-left text-xs text-slate-700 hover:text-[#5c0088] py-1.5 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">calculate</span>
                    <span>TransitLink Fare Calculator</span>
                  </button>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="text-left text-xs text-slate-500 hover:text-slate-900 py-1.5 cursor-pointer"
                  >
                    Close Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
