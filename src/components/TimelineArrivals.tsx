import React, { useState, useEffect } from 'react';
import { BusStop, BusArrival, BusService } from '../data/busServices';
import { Language, TRANSLATIONS } from '../data/translations';

interface TimelineArrivalsProps {
  currentLang: Language;
  service: BusService;
  direction: 1 | 2;
  focusedStopId: number;
  onSelectStop: (stopId: number) => void;
  onRefreshFeed: () => void;
  syncSeconds: number;
  isRefreshing: boolean;
  onOpenApiMonitor?: () => void;
  isLiveLta?: boolean;
}

export const TimelineArrivals: React.FC<TimelineArrivalsProps> = ({
  currentLang,
  service,
  direction,
  focusedStopId,
  onSelectStop,
  onRefreshFeed,
  syncSeconds,
  isRefreshing,
  onOpenApiMonitor,
  isLiveLta,
}) => {
  const [showAllStops, setShowAllStops] = useState(false);
  const t = TRANSLATIONS[currentLang];

  const currentDirData = service.directions.find((d) => d.id === direction) || service.directions[0];
  const allStops = currentDirData.stops;
  const displayedStops = showAllStops ? allStops : allStops.slice(0, 10);

  const getLoadBadge = (arrival: BusArrival, isPrimary = false) => {
    let bg = 'bg-emerald-50 text-[#007A3D]';
    let iconName = 'event_seat';

    if (arrival.load === 'standing') {
      bg = 'bg-[#FEF6E7] text-[#9C6200]';
      iconName = 'airline_seat_recline_normal';
    } else if (arrival.load === 'crowded') {
      bg = 'bg-[#FEECE8] text-[#9E1B07]';
      iconName = 'groups';
    }

    return (
      <div
        className={`${bg} px-space-sm py-space-xs rounded-lg flex items-center gap-space-2xs shadow-sm tabular-nums`}
      >
        {isPrimary && (
          <span className="material-symbols-outlined text-[15px]">directions_bus</span>
        )}
        <span className="font-countdown-display font-extrabold">{arrival.time}</span>
        <span className="material-symbols-outlined text-[14px]">{iconName}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-space-md">
      {/* Telemetry Sync Header Bar */}
      <div className="bg-white rounded-xl p-space-md shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm flex-wrap">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B159] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00B159]"></span>
          </span>
          <p className="font-body-sm text-[#64748B]">
            {t.syncedFeed} • {t.updatedAgo}{' '}
            <span className="font-semibold text-[#1a1b22] tabular-nums" id="sync-counter">
              {syncSeconds}s
            </span>{' '}
            ago (20s refresh)
          </p>
          {onOpenApiMonitor && (
            <button
              type="button"
              onClick={onOpenApiMonitor}
              className="text-[11px] font-bold text-[#5c0088] bg-[#f5d9ff] hover:bg-[#e7b4ff] px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
              title="Click to view /api/health and LTA API monitor"
            >
              <span className="material-symbols-outlined text-[13px]">monitor_heart</span>
              <span>API Health</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onRefreshFeed}
          className="flex items-center gap-space-2xs text-[#5c0088] font-label-sm px-space-sm py-space-2xs rounded-lg hover:bg-[#eeedf7] transition-colors cursor-pointer self-start sm:self-center"
          id="refresh-arrival-btn"
        >
          <span
            className={`material-symbols-outlined text-[16px] ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            cached
          </span>
          <span>{t.refresh}</span>
        </button>
      </div>

      {/* Filter Sub-header */}
      <div className="flex items-center justify-between px-space-xs text-[#64748B]">
        <span className="font-label-sm uppercase tracking-wider font-semibold">
          {t.routeSequence} (Direction {direction})
        </span>
        <span className="font-body-sm tabular-nums">
          {t.showingStops} {displayedStops.length} {t.of} {allStops.length} {t.stops}
        </span>
      </div>

      {/* Timeline Stops Sequence */}
      <div className="relative flex flex-col gap-space-sm">
        {displayedStops.map((stop, index) => {
          const isFocused = stop.id === focusedStopId;
          const stopNumber = index + 1;
          const isOrigin = index === 0;

          if (isFocused) {
            // EXPANDED LIVE TELEMETRY FOCUS STOP
            return (
              <div
                key={stop.id}
                onClick={() => onSelectStop(stop.id)}
                className="bus-stop-node relative bg-[#F3E8FF]/40 rounded-2xl p-space-lg shadow-md ring-2 ring-[#5c0088] transition-all cursor-pointer"
              >
                <div className="flex flex-col gap-space-md">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
                    <div className="flex items-start gap-space-md">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#5c0088] text-white flex items-center justify-center font-bold text-[14px] shadow-sm">
                          {stopNumber}
                        </div>
                        {index < displayedStops.length - 1 && (
                          <div className="w-0.5 h-12 bg-[#5c0088]/40 my-space-2xs"></div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <h3 className="font-headline-lg font-bold text-[#1a1b22]">
                            {stop.name}
                          </h3>
                          <span className="bg-[#5c0088] text-white font-label-sm px-space-xs py-space-2xs rounded-full">
                            {t.focusedStop}
                          </span>
                          {stop.mrtBadges &&
                            stop.mrtBadges.map((badge, bIdx) => (
                              <span
                                key={bIdx}
                                style={{ backgroundColor: badge.bg, color: badge.text }}
                                className="font-label-sm px-space-xs py-space-2xs rounded flex items-center gap-space-2xs font-extrabold text-[11px]"
                              >
                                {badge.code.includes('NEL') && (
                                  <span className="w-2 h-2 rounded-full bg-white"></span>
                                )}
                                {badge.code}
                              </span>
                            ))}
                        </div>
                        <p className="font-body-md text-[#64748B] mt-space-2xs">
                          Stop Code:{' '}
                          <span className="font-semibold text-[#1a1b22] tabular-nums">
                            {stop.code}
                          </span>{' '}
                          • {stop.road}
                        </p>
                      </div>
                    </div>

                    {/* Next Arrivals High-Density Row */}
                    <div className="flex items-center gap-space-xs self-start sm:self-center flex-wrap">
                      {stop.arrivals.length > 0 ? (
                        <>
                          <div className="bg-emerald-50 text-[#007A3D] px-space-md py-space-xs rounded-xl flex items-center gap-space-xs shadow-sm tabular-nums">
                            <span className="material-symbols-outlined text-[18px]">
                              directions_bus
                            </span>
                            <div className="flex flex-col">
                              <span className="font-countdown-display font-extrabold leading-none">
                                {stop.arrivals[0]?.time}
                              </span>
                              <span className="font-label-sm opacity-90">Seats Avail</span>
                            </div>
                          </div>

                          {stop.arrivals[1] && (
                            <div className="bg-[#FEF6E7] text-[#9C6200] px-space-sm py-space-xs rounded-xl flex items-center gap-space-xs tabular-nums">
                              <div className="flex flex-col">
                                <span className="font-label-md font-bold leading-tight">
                                  {stop.arrivals[1].time}
                                </span>
                                <span className="font-label-sm">
                                  {stop.arrivals[1].load === 'standing' ? 'Standing' : 'Seats'}
                                </span>
                              </div>
                            </div>
                          )}

                          {stop.arrivals[2] && (
                            <div className="bg-emerald-50 text-[#007A3D] px-space-sm py-space-xs rounded-xl hidden sm:flex items-center gap-space-xs tabular-nums">
                              <div className="flex flex-col">
                                <span className="font-label-md font-bold leading-tight">
                                  {stop.arrivals[2].time}
                                </span>
                                <span className="font-label-sm">Seats</span>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="font-label-sm bg-white px-space-sm py-space-xs rounded-lg text-[#64748B] border border-slate-200">
                          Origin Depot
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Telematics Detail Card */}
                  <div className="bg-white rounded-xl p-space-md shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[#64748B] uppercase tracking-wider">
                        {t.incomingBus}
                      </span>
                      <div className="flex items-center gap-space-xs mt-space-2xs">
                        <span className="font-headline-sm font-bold text-[#5c0088] tabular-nums">
                          {stop.telematics?.busPlate || 'SBS3288K'}
                        </span>
                        <span className="material-symbols-outlined text-[#64748B] text-[16px]">
                          electric_bolt
                        </span>
                      </div>
                      <span className="font-body-sm text-[#64748B]">
                        {stop.telematics?.model || 'Volvo BZL Electric DD'}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-label-sm text-[#64748B] uppercase tracking-wider">
                        {t.vehicleSpecs}
                      </span>
                      <div className="flex items-center gap-space-xs mt-space-2xs">
                        <span className="bg-[#e8e7f1] px-space-xs py-space-2xs rounded font-label-sm font-bold text-[#1a1b22]">
                          {stop.telematics?.deckType || 'Double Decker'}
                        </span>
                        <span className="bg-[#e8e7f1] px-space-xs py-space-2xs rounded font-label-sm font-bold text-[#1a1b22]">
                          WAB
                        </span>
                      </div>
                      <span className="font-body-sm text-[#64748B] mt-space-2xs">
                        {stop.telematics?.isElectric ? '100% Zero-Emission' : 'Euro 6 Clean Diesel'}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-label-sm text-[#64748B] uppercase tracking-wider">
                        {t.distanceFareStage}
                      </span>
                      <p className="font-headline-sm font-bold text-[#1a1b22] mt-space-2xs tabular-nums">
                        {stop.telematics?.distanceKm ?? '3.4'} km
                      </p>
                      <span className="font-body-sm text-[#64748B]">
                        {stop.telematics?.stage || 'Stage 6.5 from Origin'}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-label-sm text-[#64748B] uppercase tracking-wider">
                        {t.adultCardFare}
                      </span>
                      <p className="font-headline-sm font-bold text-[#006d34] mt-space-2xs tabular-nums">
                        {stop.telematics?.adultFare || '$1.29'}
                      </p>
                      <span className="font-body-sm text-[#64748B]">
                        Concession: {stop.telematics?.concessionFare || '$0.65'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // STANDARD STOP ROW
          return (
            <div
              key={stop.id}
              onClick={() => onSelectStop(stop.id)}
              className="bus-stop-node relative bg-white rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow border border-slate-100 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div className="flex items-start gap-space-md">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12px] ${
                        isOrigin
                          ? 'bg-[#5c0088] text-white shadow-sm'
                          : 'bg-[#e8e7f1] text-[#1a1b22]'
                      }`}
                    >
                      {stopNumber}
                    </div>
                    {index < displayedStops.length - 1 && (
                      <div className="w-0.5 h-10 bg-[#e3e1eb] my-space-2xs"></div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-space-sm flex-wrap">
                      <h3
                        className={`text-[17px] ${
                          isOrigin ? 'font-bold' : 'font-semibold'
                        } text-[#1a1b22] hover:text-[#5c0088] transition-colors`}
                      >
                        {stop.name}
                      </h3>
                      {stop.isTerminal && (
                        <span className="bg-[#f5d9ff] text-[#30004a] font-label-sm px-space-xs py-space-2xs rounded">
                          Terminal
                        </span>
                      )}
                      {stop.mrtBadges &&
                        stop.mrtBadges.map((badge, bIdx) => (
                          <span
                            key={bIdx}
                            style={{ backgroundColor: badge.bg, color: badge.text }}
                            className="text-[10px] font-extrabold px-1.5 py-0.5 rounded leading-none"
                          >
                            {badge.code}
                          </span>
                        ))}
                    </div>
                    <p className="font-body-sm text-[#64748B] mt-space-2xs">
                      Stop Code: <span className="tabular-nums">{stop.code}</span> • {stop.road}
                    </p>
                  </div>
                </div>

                {/* Arrivals or Depot tag */}
                <div className="flex items-center gap-space-xs self-start sm:self-center flex-wrap">
                  {stop.arrivals.length === 0 ? (
                    <span className="font-label-sm bg-[#eeedf7] px-space-sm py-space-xs rounded-lg text-[#64748B]">
                      Origin Depot
                    </span>
                  ) : (
                    stop.arrivals.map((arr, aIdx) => (
                      <React.Fragment key={aIdx}>
                        {getLoadBadge(arr, aIdx === 0)}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand/Collapse Remaining Stops Button */}
      {allStops.length > 10 && (
        <button
          type="button"
          onClick={() => setShowAllStops(!showAllStops)}
          className="w-full py-space-md bg-white hover:bg-[#eeedf7] rounded-xl font-label-md text-[#5c0088] font-bold shadow-sm transition-colors flex items-center justify-center gap-space-xs mt-space-xs border border-slate-100 cursor-pointer"
        >
          <span>
            {showAllStops
              ? `Collapse to first 10 stops`
              : `Show remaining ${allStops.length - 10} stops towards ${currentDirData.title.split('Towards ')[1] || 'Terminus'}`}
          </span>
          <span
            className={`material-symbols-outlined text-[18px] transition-transform ${
              showAllStops ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        </button>
      )}
    </div>
  );
};
