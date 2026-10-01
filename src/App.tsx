/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EmergencyAdvisory } from './components/EmergencyAdvisory';
import { SearchAndHero } from './components/SearchAndHero';
import { TimelineArrivals } from './components/TimelineArrivals';
import { InteractiveRouteMap } from './components/InteractiveRouteMap';
import { Footer } from './components/Footer';
import {
  SystemAlertsModal,
  DiversionModal,
  PlanTransferModal,
  PdfGuideModal,
  FareCalculatorModal,
  FeedbackModal,
  NearMeModal,
  BookmarksModal,
} from './components/Modals';
import { BUS_SERVICES, BusService } from './data/busServices';
import { Language } from './data/translations';

export default function App() {
  const [currentServiceNo, setCurrentServiceNo] = useState<string>('147');
  const [selectedDirection, setSelectedDirection] = useState<1 | 2>(1);
  const [focusedStopId, setFocusedStopId] = useState<number>(6);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeNav, setActiveNav] = useState<string>('live-arrivals');
  const [syncSeconds, setSyncSeconds] = useState<number>(12);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_bookmarked_services');
      return saved ? JSON.parse(saved) : ['147'];
    } catch {
      return ['147'];
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    | null
    | 'system-alerts'
    | 'diversion'
    | 'plan-transfer'
    | 'pdf-guide'
    | 'fare-calculator'
    | 'feedback'
    | 'near-me'
    | 'bookmarks'
  >(null);

  // Active Service
  const currentService: BusService = BUS_SERVICES[currentServiceNo] || BUS_SERVICES['147'];

  // Save Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('sbs_bookmarked_services', JSON.stringify(bookmarks));
    } catch {
      // Storage unavailable
    }
  }, [bookmarks]);

  // Telemetry Sync Timer (matches simulated 12s -> 30s cycle in spec)
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncSeconds((prev) => {
        if (prev >= 30) {
          return 2;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setSyncSeconds(0);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Live telematics feed refreshed with LTA DataMall');
    }, 600);
  };

  const handleToggleBookmark = () => {
    if (bookmarks.includes(currentServiceNo)) {
      setBookmarks(bookmarks.filter((b) => b !== currentServiceNo));
      showToast(`Removed Service ${currentServiceNo} from Bookmarks`);
    } else {
      setBookmarks([...bookmarks, currentServiceNo]);
      showToast(`Bookmarked Service ${currentServiceNo}`);
    }
  };

  const handleSelectService = (serviceNo: string) => {
    if (BUS_SERVICES[serviceNo]) {
      setCurrentServiceNo(serviceNo);
      setSelectedDirection(1);
      // Default focused stop to stop with index 3 or 0
      const stops = BUS_SERVICES[serviceNo].directions[0].stops;
      const targetStop = stops[5] || stops[0];
      setFocusedStopId(targetStop.id);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const isBookmarked = bookmarks.includes(currentServiceNo);

  return (
    <div className="bg-[#F8FAFC] text-[#1a1b22] font-body-md antialiased min-h-screen selection:bg-[#f5d9ff] selection:text-[#30004a]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#2f3037] text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Fixed Sticky Header */}
      <Header
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onOpenSystemAlerts={() => setActiveModal('system-alerts')}
        onOpenFeedback={() => setActiveModal('feedback')}
        onOpenFares={() => setActiveModal('fare-calculator')}
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        savedBookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setActiveModal('bookmarks')}
      />

      {/* Main Content Viewport */}
      <main className="w-full pt-[112px] bg-[#F8FAFC] min-h-screen">
        <div className="flex flex-col w-full">
          {/* Top Context & Emergency Transit Advisory Ribbon */}
          <EmergencyAdvisory
            currentLang={currentLang}
            onOpenDetails={() => setActiveModal('diversion')}
            serviceNo={currentServiceNo}
          />

          {/* Main Hero Interactive Search & Service Identification */}
          <SearchAndHero
            currentLang={currentLang}
            currentService={currentService}
            selectedDirection={selectedDirection}
            onSelectDirection={setSelectedDirection}
            onSelectService={handleSelectService}
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmark}
            onOpenPdfGuide={() => setActiveModal('pdf-guide')}
            onNearMeClick={() => setActiveModal('near-me')}
          />

          {/* Interactive Dual-Pane Workstation: Live Arrival Timeline + Geo Fleet Tracker */}
          <section className="w-full px-margin py-space-xl">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* Left Column: Interactive Stop List & Live Arrival Countdown Spine (7 Cols) */}
              <div className="lg:col-span-7">
                <TimelineArrivals
                  currentLang={currentLang}
                  service={currentService}
                  direction={selectedDirection}
                  focusedStopId={focusedStopId}
                  onSelectStop={setFocusedStopId}
                  onRefreshFeed={handleRefreshFeed}
                  syncSeconds={syncSeconds}
                  isRefreshing={isRefreshing}
                />
              </div>

              {/* Right Column: Interactive Map, Active Fleet GPS Telemetry & System Legend (5 Cols) */}
              <div className="lg:col-span-5">
                <InteractiveRouteMap
                  currentLang={currentLang}
                  service={currentService}
                  focusedStopId={focusedStopId}
                  onSelectStop={setFocusedStopId}
                  onPlanTransfer={() => setActiveModal('plan-transfer')}
                  onOpenFareGuide={() => setActiveModal('fare-calculator')}
                />
              </div>
            </div>
          </section>

          {/* Route Statistics & Frequently Traveled Links Footer Section */}
          <Footer
            serviceNo={currentServiceNo}
            onOpenFeedback={() => setActiveModal('feedback')}
            onOpenFares={() => setActiveModal('fare-calculator')}
            onOpenSystemAlerts={() => setActiveModal('system-alerts')}
            onOpenLostProperty={() => {
              showToast('SBS Transit Lost Property Office Hotline: 1800-287-2727 (Daily 7:30am - 8:00pm)');
            }}
            onOpenAccessibility={() => {
              showToast('100% of SBS Transit scheduled trunk bus fleet is Wheelchair Accessible (WAB).');
            }}
          />
        </div>
      </main>

      {/* Interactive Modals */}
      <SystemAlertsModal
        isOpen={activeModal === 'system-alerts'}
        onClose={() => setActiveModal(null)}
      />

      <DiversionModal
        isOpen={activeModal === 'diversion'}
        onClose={() => setActiveModal(null)}
        serviceNo={currentServiceNo}
      />

      <PlanTransferModal
        isOpen={activeModal === 'plan-transfer'}
        onClose={() => setActiveModal(null)}
        service={currentService}
      />

      <PdfGuideModal
        isOpen={activeModal === 'pdf-guide'}
        onClose={() => setActiveModal(null)}
        service={currentService}
      />

      <FareCalculatorModal
        isOpen={activeModal === 'fare-calculator'}
        onClose={() => setActiveModal(null)}
      />

      <FeedbackModal
        isOpen={activeModal === 'feedback'}
        onClose={() => setActiveModal(null)}
      />

      <NearMeModal
        isOpen={activeModal === 'near-me'}
        onClose={() => setActiveModal(null)}
        onSelectService={handleSelectService}
      />

      <BookmarksModal
        isOpen={activeModal === 'bookmarks'}
        onClose={() => setActiveModal(null)}
        bookmarks={bookmarks}
        onSelectService={handleSelectService}
        onRemoveBookmark={(svc) => {
          setBookmarks(bookmarks.filter((b) => b !== svc));
        }}
      />
    </div>
  );
}
