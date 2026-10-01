import React, { useState, useRef, useEffect } from 'react';
import { BusService, POPULAR_TRUNKS, BUS_SERVICES } from '../data/busServices';
import { Language, TRANSLATIONS } from '../data/translations';

interface SearchAndHeroProps {
  currentLang: Language;
  currentService: BusService;
  selectedDirection: 1 | 2;
  onSelectDirection: (dir: 1 | 2) => void;
  onSelectService: (serviceNo: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenPdfGuide: () => void;
  onNearMeClick: () => void;
}

export const SearchAndHero: React.FC<SearchAndHeroProps> = ({
  currentLang,
  currentService,
  selectedDirection,
  onSelectDirection,
  onSelectService,
  isBookmarked,
  onToggleBookmark,
  onOpenPdfGuide,
  onNearMeClick,
}) => {
  const [searchValue, setSearchValue] = useState(currentService.serviceNo);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[currentLang];

  useEffect(() => {
    setSearchValue(currentService.serviceNo);
  }, [currentService.serviceNo]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchValue.trim();
    if (BUS_SERVICES[query]) {
      onSelectService(query);
      setShowDropdown(false);
    } else if (query) {
      // Find closest match or default to 147
      const match = Object.keys(BUS_SERVICES).find((k) => k.startsWith(query));
      if (match) {
        onSelectService(match);
      } else {
        onSelectService('147');
      }
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    if (inputRef.current) inputRef.current.focus();
  };

  const suggestions = Object.keys(BUS_SERVICES).filter((num) =>
    num.toLowerCase().includes(searchValue.toLowerCase())
  );

  const dir1 = currentService.directions[0];
  const dir2 = currentService.directions[1];

  return (
    <section className="w-full bg-white shadow-sm py-space-xl px-margin border-b border-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
        {/* Search Input Container with Autocomplete */}
        <div className="relative w-full">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-space-sm">
            <div className="relative flex-1 bg-[#F8FAFC] rounded-xl shadow-inner flex items-center px-space-md py-space-xs border border-slate-200 focus-within:ring-2 focus-within:ring-[#7a1cac] transition-all">
              <span className="material-symbols-outlined text-[#64748B] text-[22px] mr-space-sm">search</span>
              <input
                ref={inputRef}
                autoComplete="off"
                className="w-full bg-transparent font-headline-sm text-[#1a1b22] placeholder:text-[#64748B] placeholder:font-normal focus:outline-none"
                id="bus-service-input"
                placeholder={t.searchPlaceholder}
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[#64748B] hover:text-[#1a1b22] p-space-xs rounded-full cursor-pointer"
                  id="clear-search-btn"
                  title="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </button>
              )}

              <div className="h-6 w-[1px] bg-[#e3e1eb] mx-space-xs"></div>

              <button
                type="button"
                onClick={onNearMeClick}
                className="flex items-center gap-space-2xs text-[#5c0088] font-label-md px-space-sm py-space-xs rounded-lg hover:bg-[#f5d9ff]/40 transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
                <span className="hidden sm:inline">{t.nearMe}</span>
              </button>
            </div>

            <button
              type="submit"
              className="bg-[#5c0088] text-white font-label-md px-space-xl py-space-md rounded-xl hover:bg-[#7a1cac] transition-colors flex items-center justify-center gap-space-sm shadow-md cursor-pointer shrink-0"
            >
              <span>{t.findService}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && suggestions.length > 0 && searchValue.trim() !== currentService.serviceNo && (
            <div className="absolute top-full left-0 right-0 md:right-40 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-40 max-h-60 overflow-y-auto">
              {suggestions.map((num) => {
                const s = BUS_SERVICES[num];
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      onSelectService(num);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-space-md py-space-sm hover:bg-[#f4f2fd] flex items-center justify-between cursor-pointer border-b border-slate-50 last:border-none"
                  >
                    <div className="flex items-center gap-space-sm">
                      <span className="font-bold text-[#5c0088] bg-[#f5d9ff] px-2 py-0.5 rounded text-sm">
                        {num}
                      </span>
                      <span className="font-body-md text-slate-800 font-medium">
                        {s.origin} ⇄ {s.destination}
                      </span>
                    </div>
                    <span className="text-xs text-[#64748B]">{s.totalDistance}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Access Frequent Services Chips */}
          <div className="flex items-center gap-space-xs overflow-x-auto pt-space-md scrollbar-none">
            <span className="font-label-sm text-[#64748B] uppercase tracking-wider shrink-0 mr-space-xs">
              {t.popularTrunk}
            </span>
            {POPULAR_TRUNKS.map((trunk) => {
              const isActive = trunk === currentService.serviceNo;
              return (
                <button
                  key={trunk}
                  type="button"
                  onClick={() => onSelectService(trunk)}
                  className={`service-pill-chip px-space-md py-space-xs rounded-full font-label-md transition-all active:scale-95 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#5c0088] text-white font-bold shadow-sm'
                      : 'bg-[#e8e7f1] text-[#1a1b22] hover:bg-[#e3e1eb]'
                  }`}
                >
                  {trunk}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Meta Card (Active Trunk Data) */}
        <div className="bg-[#f4f2fd] rounded-2xl p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg shadow-sm border border-[#e3e1eb]/60">
          <div className="flex items-start sm:items-center gap-space-lg">
            <div className="h-16 w-20 bg-[#5c0088] text-white rounded-xl flex flex-col items-center justify-center shrink-0 shadow-md">
              <span className="font-service-number-lg tracking-tight">{currentService.serviceNo}</span>
              <span className="font-label-sm text-[#e7b4ff] -mt-space-2xs">{currentService.category}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-headline-lg text-[#1a1b22]">{currentService.origin}</span>
                <span className="material-symbols-outlined text-[#64748B] text-[20px]">sync_alt</span>
                <span className="font-headline-lg text-[#1a1b22]">{currentService.destination}</span>
              </div>
              <div className="flex items-center gap-space-md mt-space-2xs flex-wrap">
                {currentService.wab && (
                  <span className="font-body-sm text-[#64748B] flex items-center gap-space-2xs">
                    <span className="material-symbols-outlined text-[16px] text-[#5c0088]">accessible</span>
                    Wheelchair Accessible (WAB)
                  </span>
                )}
                {currentService.electricFleet && (
                  <>
                    <span className="text-[#e3e1eb]">•</span>
                    <span className="font-body-sm text-[#64748B] flex items-center gap-space-2xs">
                      <span className="material-symbols-outlined text-[16px] text-[#006d34]">eco</span>
                      Electric Fleet Assigned
                    </span>
                  </>
                )}
                <span className="text-[#e3e1eb]">•</span>
                <span className="font-body-sm text-[#64748B]">
                  Total Distance: {currentService.totalDistance}
                </span>
              </div>
            </div>
          </div>

          {/* Service Quick Actions */}
          <div className="flex items-center gap-space-sm shrink-0">
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`px-space-md py-space-sm bg-white rounded-lg font-label-md transition-colors flex items-center gap-space-xs shadow-sm border border-slate-200 cursor-pointer ${
                isBookmarked ? 'text-[#5c0088] font-bold ring-1 ring-[#5c0088]' : 'text-[#1a1b22] hover:text-[#5c0088]'
              }`}
              id="bookmark-btn"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {isBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
              <span>{isBookmarked ? t.bookmarked : t.bookmarkService}</span>
            </button>

            <button
              type="button"
              onClick={onOpenPdfGuide}
              className="px-space-md py-space-sm bg-white rounded-lg font-label-md text-[#1a1b22] hover:text-[#5c0088] transition-colors flex items-center gap-space-xs shadow-sm border border-slate-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#D9381E]">picture_as_pdf</span>
              <span>{t.pdfGuide}</span>
            </button>
          </div>
        </div>

        {/* Direction Switcher Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm bg-[#eeedf7] rounded-xl p-space-2xs">
          <button
            type="button"
            onClick={() => onSelectDirection(1)}
            className={`direction-tab flex items-start gap-space-md p-space-md rounded-lg transition-all text-left cursor-pointer ${
              selectedDirection === 1 ? 'bg-white shadow-sm ring-1 ring-slate-200/80' : 'hover:bg-white/60'
            }`}
            id="dir-btn-1"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${
                selectedDirection === 1 ? 'bg-[#5c0088] text-white shadow-sm' : 'bg-[#e3e1eb] text-[#4e4352]'
              }`}
            >
              1
            </div>
            <div className="flex flex-col">
              <span
                className={`font-label-md ${
                  selectedDirection === 1 ? 'text-[#5c0088] font-bold' : 'text-[#1a1b22] font-semibold'
                }`}
              >
                {dir1.title}
              </span>
              <span className="font-body-sm text-[#64748B]">{dir1.subtitle}</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectDirection(2)}
            className={`direction-tab flex items-start gap-space-md p-space-md rounded-lg transition-all text-left cursor-pointer ${
              selectedDirection === 2 ? 'bg-white shadow-sm ring-1 ring-slate-200/80' : 'hover:bg-white/60'
            }`}
            id="dir-btn-2"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${
                selectedDirection === 2 ? 'bg-[#5c0088] text-white shadow-sm' : 'bg-[#e3e1eb] text-[#4e4352]'
              }`}
            >
              2
            </div>
            <div className="flex flex-col">
              <span
                className={`font-label-md ${
                  selectedDirection === 2 ? 'text-[#5c0088] font-bold' : 'text-[#1a1b22] font-semibold'
                }`}
              >
                {dir2.title}
              </span>
              <span className="font-body-sm text-[#64748B]">{dir2.subtitle}</span>
            </div>
          </button>
        </div>

        {/* Timetable Operational Snapshot Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
          <div className="bg-white rounded-xl p-space-md shadow-sm border border-slate-100 flex flex-col gap-space-xs">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="font-label-sm uppercase tracking-wider font-semibold">{t.weekdays}</span>
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            </div>
            <div className="flex items-baseline justify-between mt-space-xs">
              <div>
                <span className="font-body-sm text-[#64748B]">{t.operatingHours}</span>
                <p className="font-headline-sm font-bold text-[#1a1b22] tabular-nums">
                  {currentService.timetable.weekdayHours}
                </p>
              </div>
              <div className="text-right">
                <span className="font-body-sm text-[#64748B]">{t.headway}</span>
                <p className="font-label-md font-bold text-[#006d34] tabular-nums">
                  {currentService.timetable.weekdayHeadway}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-space-md shadow-sm border border-slate-100 flex flex-col gap-space-xs">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="font-label-sm uppercase tracking-wider font-semibold">{t.saturdays}</span>
              <span className="material-symbols-outlined text-[16px]">today</span>
            </div>
            <div className="flex items-baseline justify-between mt-space-xs">
              <div>
                <span className="font-body-sm text-[#64748B]">{t.operatingHours}</span>
                <p className="font-headline-sm font-bold text-[#1a1b22] tabular-nums">
                  {currentService.timetable.satHours}
                </p>
              </div>
              <div className="text-right">
                <span className="font-body-sm text-[#64748B]">{t.headway}</span>
                <p className="font-label-md font-bold text-[#1a1b22] tabular-nums">
                  {currentService.timetable.satHeadway}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-space-md shadow-sm border border-slate-100 flex flex-col gap-space-xs">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="font-label-sm uppercase tracking-wider font-semibold">{t.sundaysHolidays}</span>
              <span className="material-symbols-outlined text-[16px]">celebration</span>
            </div>
            <div className="flex items-baseline justify-between mt-space-xs">
              <div>
                <span className="font-body-sm text-[#64748B]">{t.operatingHours}</span>
                <p className="font-headline-sm font-bold text-[#1a1b22] tabular-nums">
                  {currentService.timetable.sunHours}
                </p>
              </div>
              <div className="text-right">
                <span className="font-body-sm text-[#64748B]">{t.headway}</span>
                <p className="font-label-md font-bold text-[#1a1b22] tabular-nums">
                  {currentService.timetable.sunHeadway}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
