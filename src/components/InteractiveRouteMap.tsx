import React, { useState } from 'react';
import { BusService, BusStop } from '../data/busServices';
import { Language, TRANSLATIONS } from '../data/translations';

interface InteractiveRouteMapProps {
  currentLang: Language;
  service: BusService;
  focusedStopId: number;
  onSelectStop: (stopId: number) => void;
  onPlanTransfer: () => void;
  onOpenFareGuide: () => void;
}

export const InteractiveRouteMap: React.FC<InteractiveRouteMapProps> = ({
  currentLang,
  service,
  focusedStopId,
  onSelectStop,
  onPlanTransfer,
  onOpenFareGuide,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isCenteredOnMe, setIsCenteredOnMe] = useState(false);
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);
  const [hoveredBus, setHoveredBus] = useState<string | null>(null);
  const t = TRANSLATIONS[currentLang];

  const handleCenterOnMe = () => {
    setIsCenteredOnMe(true);
    // Approximate user in Serangoon / Kovan area
    setUserLocation({ x: 44, y: 36 });
    setTimeout(() => {
      // Keep GPS pulse visible
    }, 500);
  };

  const currentStops = service.directions[0].stops;
  const focusedStop = currentStops.find((s) => s.id === focusedStopId) || currentStops[5] || currentStops[0];

  return (
    <div className="flex flex-col gap-space-lg lg:sticky lg:top-24">
      {/* Live Map Card Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
        <div className="p-space-md bg-[#f4f2fd] flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[#5c0088] text-[20px]">map</span>
            <span className="font-label-md font-bold text-[#1a1b22]">
              {t.interactiveRouteMap}
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#006d34] animate-pulse"></span>
            <span className="font-label-sm text-[#64748B] tabular-nums">
              {service.activeBuses.length || 4} {t.fleetBusesActive}
            </span>
          </div>
        </div>

        {/* Singapore GIS Map Canvas with Real-Time Service Line Overlays */}
        <div className="relative w-full h-80 bg-[#dad9e3] overflow-hidden select-none">
          {/* Map Base Canvas with Zoom Transform */}
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-300 ease-out"
            data-location="Upper Serangoon Road, Singapore"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDRVj8adPR6XGJsG7KbmnXlRQQ2zoj5Eh47-Fm_zc8bWwDdvTw7Xr4YRSn_qYBnAI8Q-7b48-GbY_pWjZ3TfddEQiOBbjHJ6DMPFvBs2jEvbyZLz0-bUnQJ5hgTzR4t_Qoj1eoPTgdHhA5gX83Ai1VfxS-FUsVzGgB4iKqZFVvIqRvWI-Ac3mbmltY0M0AW7aDdHgjRD7ITuh0Hm4mzhlBSBGt1rJOW_sVxwbDJoLKoXc98T0mUmG9q')`,
              transform: `scale(${zoomLevel})`,
              transformOrigin: isCenteredOnMe ? '44% 36%' : `${focusedStop.mapCoords.x}% ${focusedStop.mapCoords.y}%`,
            }}
          >
            {/* SVG Path Route Line across stops */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5c0088" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#8A31BC" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              <polyline
                points="20,16 23,22 27,26 30,29 33,31 42,34 48,38 55,44 62,50 68,56 72,64 74,70 65,78 30,85"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Dynamic GPS Active Bus Vehicle Markers & UI Layer */}
          <div className="absolute inset-0 p-space-md flex flex-col justify-between pointer-events-none">
            {/* Map Top Overlay: Quick Geo Toggle & Zoom */}
            <div className="flex items-center justify-between pointer-events-auto">
              {/* Zoom Controls */}
              <div className="flex items-center bg-white/90 backdrop-blur rounded-lg shadow-md p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.0))}
                  className="w-7 h-7 flex items-center justify-center text-slate-700 hover:text-[#5c0088] rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <div className="w-[1px] h-4 bg-slate-200 mx-0.5"></div>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 1.0))}
                  className="w-7 h-7 flex items-center justify-center text-slate-700 hover:text-[#5c0088] rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
              </div>

              {/* Center On Me Button */}
              <button
                type="button"
                onClick={handleCenterOnMe}
                className="bg-white/95 backdrop-blur px-space-sm py-space-xs rounded-lg shadow-md font-label-sm text-[#1a1b22] hover:text-[#5c0088] flex items-center gap-space-2xs transition-colors border border-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#5c0088]">navigation</span>
                <span>{t.centerOnMe}</span>
              </button>
            </div>

            {/* Simulated Interactive Fleet Overlays */}
            <div className="relative w-full h-full pointer-events-auto">
              {/* Bus 1 Marker (Default near Kovan / Upper Serangoon) */}
              <div
                onMouseEnter={() => setHoveredBus('SBS3288K')}
                onMouseLeave={() => setHoveredBus(null)}
                onClick={() => onSelectStop(6)}
                className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform hover:scale-110 z-20"
                style={{ top: '32%', left: '38%' }}
              >
                <div className="bg-[#5c0088] text-white rounded-full px-2 py-1 flex items-center gap-1 shadow-lg ring-2 ring-white">
                  <span className="material-symbols-outlined text-[13px]">directions_bus</span>
                  <span className="text-[11px] font-bold">{service.serviceNo}</span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#2f3037] text-[#f1effa] text-[10px] px-2 py-1 rounded shadow whitespace-nowrap z-30 pointer-events-none transition-opacity">
                  SBS3288K (To Clementi) • Seats Avail
                </div>
              </div>

              {/* Bus 2 Marker */}
              <div
                onMouseEnter={() => setHoveredBus('SBS6712B')}
                onMouseLeave={() => setHoveredBus(null)}
                onClick={() => onSelectStop(8)}
                className="absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform hover:scale-110 z-20"
                style={{ top: '48%', left: '60%' }}
              >
                <div className="bg-[#5c0088] text-white rounded-full px-2 py-1 flex items-center gap-1 shadow-lg ring-2 ring-white">
                  <span className="material-symbols-outlined text-[13px]">directions_bus</span>
                  <span className="text-[11px] font-bold">{service.serviceNo}</span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#2f3037] text-[#f1effa] text-[10px] px-2 py-1 rounded shadow whitespace-nowrap z-30 pointer-events-none transition-opacity">
                  SBS6712B • Standing Avail
                </div>
              </div>

              {/* Active Focused Stop Pulsing Radar Marker */}
              {focusedStop && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500"
                  style={{
                    top: `${focusedStop.mapCoords.y}%`,
                    left: `${focusedStop.mapCoords.x}%`,
                  }}
                  title={focusedStop.name}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-[#5c0088] opacity-60"></span>
                    <div className="w-4 h-4 rounded-full bg-[#5c0088] ring-4 ring-white shadow-md"></div>
                  </div>
                </div>
              )}

              {/* Commuter Live Location Pin if centered on me */}
              {isCenteredOnMe && userLocation && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 animate-in fade-in"
                  style={{
                    top: `${userLocation.y}%`,
                    left: `${userLocation.x}%`,
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-75"></span>
                    <div className="w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white shadow-lg flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-blue-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    You Are Here
                  </div>
                </div>
              )}
            </div>

            {/* Map Bottom Bar: Geo Info */}
            <div className="bg-white/95 backdrop-blur rounded-lg p-space-xs shadow-md flex items-center justify-between text-[#64748B] font-label-sm pointer-events-auto border border-slate-200">
              <span className="flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-[14px]">speed</span>
                Fleet Avg: 24 km/h
              </span>
              <span className="flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-[14px]">traffic</span>
                Flow: Normal
              </span>
            </div>
          </div>
        </div>

        {/* Commuter Telemetry Legend */}
        <div className="p-space-lg flex flex-col gap-space-md">
          <span className="font-label-sm uppercase tracking-wider font-semibold text-[#64748B]">
            Live Occupancy & Bus Code Legend
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="w-3 h-3 rounded-full bg-[#00B159] shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-label-sm font-semibold text-[#1a1b22]">Seats Avail</span>
                <span className="font-body-sm text-[#64748B]">&lt; 60% Load</span>
              </div>
            </div>

            <div className="flex items-center gap-space-xs">
              <span className="w-3 h-3 rounded-full bg-[#F5A623] shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-label-sm font-semibold text-[#1a1b22]">Standing</span>
                <span className="font-body-sm text-[#64748B]">60% - 85% Load</span>
              </div>
            </div>

            <div className="flex items-center gap-space-xs">
              <span className="w-3 h-3 rounded-full bg-[#D9381E] shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-label-sm font-semibold text-[#1a1b22]">Crowded</span>
                <span className="font-body-sm text-[#64748B]">&gt; 85% Load</span>
              </div>
            </div>
          </div>

          <div className="pt-space-sm border-t border-[#e3e1eb] flex items-center justify-between text-[#64748B] font-body-sm">
            <div className="flex items-center gap-space-sm">
              <span className="flex items-center gap-1 font-semibold text-[#1a1b22]">
                <span className="material-symbols-outlined text-[16px] text-[#5c0088]">accessible</span>{' '}
                WAB Certified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-[#1a1b22]">
                <span className="material-symbols-outlined text-[16px]">electric_bolt</span> EV Fleet
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenFareGuide}
              className="text-[#5c0088] hover:underline font-label-sm cursor-pointer"
            >
              Fare Guide
            </button>
          </div>
        </div>
      </div>

      {/* Community Transit Spotlight Card */}
      <div className="bg-gradient-to-br from-[#5c0088] to-[#7a1cac] text-white rounded-2xl p-space-lg shadow-md flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <span className="font-label-sm uppercase tracking-wider text-[#e7b4ff] font-bold">
            {t.commuterTip}
          </span>
          <span className="material-symbols-outlined text-[20px] text-[#f5d9ff]">commute</span>
        </div>

        <div className="flex flex-col gap-space-xs">
          <h4 className="font-headline-sm font-bold leading-snug">
            {t.fastTransfers}
          </h4>
          <p className="font-body-sm text-[#e7b4ff]/90 leading-relaxed">
            Alighting at Stop 66359 gives sheltered 2-minute basement access to both the Circle Line
            (CC13) and North East Line (NE12). Avoid Eu Tong Sen peak traffic by transferring to MRT
            here.
          </p>
        </div>

        <div className="flex items-center gap-space-md pt-space-xs flex-wrap">
          <button
            type="button"
            onClick={onPlanTransfer}
            className="bg-white text-[#5c0088] font-label-md px-space-md py-space-xs rounded-lg hover:bg-[#fbf8ff] transition-colors shadow cursor-pointer font-bold"
          >
            {t.planTransfer}
          </button>
          <span className="font-body-sm text-[#e7b4ff]">Valid for Transit Concessions</span>
        </div>
      </div>
    </div>
  );
};
